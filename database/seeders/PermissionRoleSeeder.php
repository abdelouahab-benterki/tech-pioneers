<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // User management
            'view users',
            'create users',
            'edit users',
            'delete users',

            // Challenge management
            'view challenges',
            'create challenges',
            'edit challenges',
            'delete challenges',
            'manage challenge-variants',

            // Competition permissions
            'participate in challenges',
            'view leaderboard',
            'submit solutions',
            'view own results'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'admin']);
        $competitorRole = Role::create(['name' => 'competitor']);

        // Assign permissions to admin
        $adminRole->givePermissionTo([
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view challenges',
            'create challenges',
            'edit challenges',
            'delete challenges',
            'manage challenge-variants',
            'view leaderboard'
        ]);

        // Assign permissions to competitor
        $competitorRole->givePermissionTo([
            'view challenges',
            'participate in challenges',
            'view leaderboard',
            'submit solutions',
            'view own results'
        ]);

    }
}
