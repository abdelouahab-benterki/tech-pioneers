import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserForm from './UserForm';
import { Head } from '@inertiajs/react';

export default function CreateUser({availableRoles}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create User
                </h2>
            }
        >
            <Head title="Create User" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <UserForm availableRoles={availableRoles} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
