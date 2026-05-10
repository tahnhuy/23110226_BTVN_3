/**
 * Maps each role to allowed permission keys.
 * Admin is handled in middleware as full access (see requirePermission).
 */
const PERMISSIONS_BY_ROLE = {
    user: ['profile:read', 'profile:update'],
    admin: [
        'profile:read',
        'profile:update',
        'users:list',
        'users:manage',
        'admin:access'
    ]
};

module.exports = { PERMISSIONS_BY_ROLE };
