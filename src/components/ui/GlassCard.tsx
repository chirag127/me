/**
 * GlassCard — Glassmorphism card built on Mantine Paper
 */

import { Paper, type PaperProps } from '@mantine/core';
import { type ReactNode } from 'react';

interface GlassCardProps extends PaperProps {
    children: ReactNode;
    hover?: boolean;
}

export function GlassCard({
    children,
    hover = false,
    style,
    ...props
}: GlassCardProps) {
    return (
        <Paper
            radius="lg"
            p="lg"
            style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(var(--glass-blur))',
                WebkitBackdropFilter: 'blur(var(--glass-blur))',
                border: '1px solid var(--glass-border)',
                transition: hover
                    ? 'transform 0.2s ease, box-shadow 0.2s ease'
                    : undefined,
                cursor: hover ? 'pointer' : undefined,
                ...style,
            }}
            onMouseEnter={
                hover
                    ? (e) => {
                        (e.currentTarget as HTMLElement).style.transform =
                            'translateY(-2px)';
                        (e.currentTarget as HTMLElement).style.boxShadow =
                            '0 8px 32px rgba(0,122,255,0.15)';
                    }
                    : undefined
            }
            onMouseLeave={
                hover
                    ? (e) => {
                        (e.currentTarget as HTMLElement).style.transform = '';
                        (e.currentTarget as HTMLElement).style.boxShadow = '';
                    }
                    : undefined
            }
            {...props}
        >
            {children}
        </Paper>
    );
}
