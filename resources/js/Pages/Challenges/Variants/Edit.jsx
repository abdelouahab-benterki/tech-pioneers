import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import VariantForm from './VariantForm.jsx';
import { Head } from '@inertiajs/react';

export default function Edit({ challenge, variant }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Variant
                </h2>
            }
        >
            <Head title={`Edit Variant - ${challenge.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <VariantForm
                        challenge={challenge}
                        variant={variant}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
