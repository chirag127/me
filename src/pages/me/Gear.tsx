/**
 * Gear — Hardware and software setup
 */
import {
  Container, SimpleGrid, Text, Group,
  Badge, Stack,
} from '@mantine/core';
import { usePageMeta } from '@hooks/usePageMeta';
import { PageHeader } from '@components/ui/PageHeader';
import { GlassCard } from '@components/ui/GlassCard';

const categories = [
  {
    name: 'PC', items: [
      { n: 'AMD Ryzen 7', tag: 'CPU' },
      { n: '32GB DDR5', tag: 'RAM' },
      { n: 'RTX 4060', tag: 'GPU' },
      { n: '1TB NVMe SSD', tag: 'Storage' },
    ]
  },
  {
    name: 'Peripherals', items: [
      { n: 'Keychron K8 Pro', tag: 'Keyboard' },
      { n: 'Logitech MX Master 3', tag: 'Mouse' },
      { n: 'Dell 27" 4K', tag: 'Monitor' },
    ]
  },
  {
    name: 'Software', items: [
      { n: 'VS Code + Neovim', tag: 'Editor' },
      { n: 'Windows 11 + WSL2', tag: 'OS' },
      { n: 'Firefox Developer', tag: 'Browser' },
      { n: 'Windows Terminal', tag: 'Terminal' },
    ]
  },
  {
    name: 'Dev Tools', items: [
      { n: 'Docker Desktop', tag: 'Container' },
      { n: 'Postman', tag: 'API' },
      { n: 'GitHub Actions', tag: 'CI/CD' },
      { n: 'Cloudflare Pages', tag: 'Deploy' },
    ]
  },
];

export default function Gear() {
  usePageMeta({
    title: 'Gear',
    description: 'My hardware & software setup',
  });
  return (
    <Container size="xl" py="xl">
      <PageHeader
        title="Gear"
        description="Hardware & software setup"
        breadcrumb={['Me', 'Gear']}
      />
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing="md"
      >
        {categories.map((cat) => (
          <GlassCard key={cat.name}>
            <Text fw={600} mb="md"
              className="gradient-text">
              {cat.name}
            </Text>
            <Stack gap="xs">
              {cat.items.map((item) => (
                <Group key={item.n}
                  justify="space-between">
                  <Text size="sm">{item.n}</Text>
                  <Badge size="xs"
                    variant="outline">
                    {item.tag}
                  </Badge>
                </Group>
              ))}
            </Stack>
          </GlassCard>
        ))}
      </SimpleGrid>
    </Container>
  );
}
