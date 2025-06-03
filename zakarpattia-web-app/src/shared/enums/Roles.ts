export const Roles = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    EDITOR: 'EDITOR',
    MODERATOR: 'MODERATOR'
} as const;

export type Role = typeof Roles[keyof typeof Roles];


