export const hasPermission = (desiredPermissions: number, actualPermissions: number) => {
    if (desiredPermissions === 0) {
        return true;
    }

    if (actualPermissions === 0) {
        return false;
    }

    // Permissions are OK in any position that the desired does not declare the given permission,
    // or where desired has a permission that the actual permission also has.
    const matchingPermissions = ~desiredPermissions | (desiredPermissions & actualPermissions);
    // Ensure that all bits are 1, aka all permissions in the desired match.
    return ~matchingPermissions === 0;
};
