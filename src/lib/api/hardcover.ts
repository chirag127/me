import { fetchGraphQL } from './fetcher';
import { CONFIG } from '../config';

const HC_API = 'https://hardcover.app/graphql';

const userBooksQuery = `
  query ($username: String!) {
    user(username: $username) {
      id
      username
      name
      bio
      imageUrl
      booksReadCount
      booksReadingCount: userBooks(readStatus: "reading") {
        count
      }
      booksToReadCount: userBooks(readStatus: "want_to_read") {
        count
      }
      userBooks(readStatus: "read") {
        count
        edges {
          node {
            book {
              id
              title
              coverImageUrl
              rating
              releaseYear
              contributions {
                author {
                  name
                }
              }
              cachedTags
            }
            rating
            datesRead
            startedAt
            finishedAt
          }
        }
      }
    }
  }
`;

export async function fetchHardcoverBooks() {
  const authToken = process.env.HARDCOVER_AUTH_TOKEN;
  if (!authToken) return null;

  try {
    const res = await fetch(HC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query: userBooksQuery,
        variables: { username: CONFIG.user.hardcover },
      }),
    });

    const data = await res.json();
    if (data?.errors) {
      console.warn('[Hardcover] GraphQL errors:', data.errors);
      return null;
    }

    const user = data?.data?.user;
    if (!user) return null;

    const readBooks = (user.userBooks?.edges || []).map((edge: any) => {
      const book = edge.node.book;
      const authors = (book.contributions || [])
        .map((c: any) => c.author?.name)
        .filter(Boolean);

      return {
        title: book.title,
        authors,
        coverUrl: book.coverImageUrl,
        rating: edge.node.rating || book.rating || null,
        releaseYear: book.releaseYear,
        startedAt: edge.node.startedAt,
        finishedAt: edge.node.finishedAt,
        tags: book.cachedTags || [],
      };
    });

    return {
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.imageUrl,
      booksReadCount: user.booksReadCount || 0,
      readBooks,
    };
  } catch (err) {
    console.error('[Hardcover] Failed:', err);
    return null;
  }
}
