import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Paper,
    MantineProvider
} from '@mantine/core';

import logo from '../../../images/logo.png';

// You can create a Logo component for better organization
const Logo = () => (
    <svg
        viewBox="0 0 200 60"
        className="w-40 h-auto mx-auto mb-8"
    >
        {/* Replace this with your actual logo SVG path */}
        <path
            fill="#203496"
            d="M20 40 C20 30, 40 30, 40 20 C40 10, 60 10, 60 20 C60 30, 80 30, 80 20"
            stroke="#7F2BFF"
            strokeWidth="4"
            strokeLinecap="round"
        />
        <path
            fill="none"
            d="M90 30 L120 30"
            stroke="#09F205"
            strokeWidth="4"
            strokeLinecap="round"
        />
        {/* Add your company name or more logo elements here */}
    </svg>
);

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    const theme = {
        colors: {
            brand: [
                '#f5f0ff',
                '#e8dbff',
                '#d4bfff',
                '#b799ff',
                '#9c70ff',
                '#8f4dff',
                '#7F2BFF',
                '#6a24d9',
                '#5c1ebf',
                '#4d19a6',
            ],
            secondary: [
                '#e6eaff',
                '#ccd3ff',
                '#a3b0ff',
                '#7a8cff',
                '#5268ff',
                '#294bff',
                '#203496',
                '#1a2a7a',
                '#142066',
                '#0f1952',
            ],
        },
        primaryColor: 'brand',
        primaryShade: 6,
    };

    return (
        <MantineProvider
            theme={theme}
            withGlobalStyles
            withNormalizeCSS
        >
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-50">
                <div className="w-full sm:max-w-md mt-6 px-6 py-4">
                    <div className="mb-6 w-24 mx-auto">
                        <img src={logo} className='w-full object-contain'/>
                    </div>

                    <Paper withBorder shadow="md" p="xl" radius="md" className="bg-white">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-4">
                                <TextInput
                                    label="Email"
                                    placeholder="your@email.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={errors.email}
                                    required
                                    classNames={{
                                        input: 'focus:ring-primary focus:border-primary',
                                        label: 'text-gray-700'
                                    }}
                                />

                                <PasswordInput
                                    label="Password"
                                    placeholder="Your password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={errors.password}
                                    required
                                    classNames={{
                                        input: 'focus:ring-primary focus:border-primary',
                                        label: 'text-gray-700'
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Checkbox
                                    label="Remember me"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.currentTarget.checked)}
                                    className="text-sm text-gray-600"
                                    styles={(theme) => ({
                                        input: {
                                            '&:checked': {
                                                backgroundColor: 'var(--tw-color-primary)',
                                                borderColor: 'var(--tw-color-primary)',
                                            },
                                        },
                                    })}
                                />

                                {/*<a*/}
                                {/*    href={route('password.request')}*/}
                                {/*    className="text-sm text-primary hover:text-secondary transition-colors duration-200"*/}
                                {/*>*/}
                                {/*    Forgot password?*/}
                                {/*</a>*/}
                            </div>

                            <div className="space-y-3">
                                <Button
                                    fullWidth
                                    type="submit"
                                    loading={processing}
                                    className="bg-primary hover:bg-secondary transition-colors duration-200"
                                >
                                    Sign in
                                </Button>

                                <div className="text-center text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <a
                                        href={route('register')}
                                        className="text-primary hover:text-secondary transition-colors duration-200"
                                    >
                                        Register
                                    </a>
                                </div>
                            </div>
                        </form>
                    </Paper>
                </div>
            </div>
        </MantineProvider>
    );
}
