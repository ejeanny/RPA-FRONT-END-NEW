"use client";
import { Fragment, use, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
    Bars3Icon,
    BellIcon,
    FolderOpenIcon,
    UsersIcon,
    XMarkIcon,
    AcademicCapIcon,
    DocumentChartBarIcon,
} from "@heroicons/react/24/outline";
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import Logo from "../images/logo.png";
import LogoRound from "../images/logo-round.png";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import React from "react";
import Link from "next/link";
import { User } from "next-auth";
import { User as UserType } from "@/Types/types";
import { Card } from "@/components/ui/card";
import SidePanel from "@/components/ui/SidePanel";
// import ProfileForm from "./forms/profile-form";
import { set } from "date-fns";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

interface SideBarProps {
    children: React.ReactNode;
}

const SideBar: React.FC<SideBarProps> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();
    const [navigation, setNavigation] = useState<any[]>([]);
    const [user, setUser] = useState<User>({
        id: "",
        firstName: "",
        lastName: "",
        fullName: "",
        email: "",
        role: "user",
    });
    useEffect(() => {
        if (session) {
            setUser({
                id: session?.user.id || "defaultId",
                firstName: session?.user.firstName || "defaultFirstName",
                lastName: session?.user.lastName || "defaultLastName",
                fullName: session?.user.fullName || "defaultFullName",
                email: session?.user.email || "defaultEmail",
                role: session?.user.role as
                    | "user"
                    | "employee"
                    | "assistant"
                    | "administrator",
            });
            if ((session?.user as User).role == "administrator") {
                setNavigation(
                    [
                        // //{ name: "Dashboard", href: "/", icon: HomeIcon },
                        {
                            name: "Mes notes de frais",
                            href: "/my-expenses",
                            icon: FolderOpenIcon,
                        },
                        {
                            name: "Mes Parcours",
                            href: "/my-courses",
                            icon: FolderOpenIcon,
                        },
                        {
                            name: "Gestion des Notes de frais",
                            href: "/expenses",
                            icon: DocumentChartBarIcon,
                        },

                        {
                            name: "Gestion des Parcours",
                            href: "/courses",
                            icon: AcademicCapIcon,
                        },
                        {
                            name: "Gestions des Utilisateurs",
                            href: "/users",
                            icon: UsersIcon,
                        },
                    ].map(item => ({
                        ...item,
                        current: item.href === pathname,
                    }))
                );
            } else if ((session?.user as User).role == "assistant ") {
                setNavigation(
                    [
                        //{ name: "Dashboard", href: "/", icon: HomeIcon },
                        {
                            name: "Mes notes de frais",
                            href: "/my-expenses",
                            icon: FolderOpenIcon,
                        },
                        {
                            name: "Mes Parcours",
                            href: "/my-courses",
                            icon: FolderOpenIcon,
                        },
                        {
                            name: "Gestion des Parcours",
                            href: "/courses",
                            icon: AcademicCapIcon,
                        },
                        {
                            name: "Gestions des Utilisateurs",
                            href: "/users",
                            icon: UsersIcon,
                        },
                    ].map(item => ({
                        ...item,
                        current: item.href === pathname,
                    }))
                );
            } else {
                setNavigation(
                    [
                        //{ name: "Dashboard", href: "/", icon: HomeIcon },
                        {
                            name: "Mes notes de frais",
                            href: "/my-expenses",
                            icon: FolderOpenIcon,
                        },
                        {
                            name: "Mes Parcours",
                            href: "/my-courses",
                            icon: FolderOpenIcon,
                        },
                    ].map(item => ({
                        ...item,
                        current: item.href === pathname,
                    }))
                );
            }
        }
    }, [session, pathname]);

    const userNavigation = [
        { name: "Mon profil", isLink: false, onClick: () => setOpen(true) },
        { name: "Déconnexion", isLink: false, onClick: () => signOut() },
    ];
    return (
        <>
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog
                        as='div'
                        className='relative z-50 lg:hidden'
                        onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter='transition-opacity ease-linear duration-300'
                            enterFrom='opacity-0'
                            enterTo='opacity-100'
                            leave='transition-opacity ease-linear duration-300'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'>
                            <div className='fixed inset-0 bg-gray-900/80' />
                        </Transition.Child>

                        <div className='fixed inset-0 flex'>
                            <Transition.Child
                                as={Fragment}
                                enter='transition ease-in-out duration-300 transform'
                                enterFrom='-translate-x-full'
                                enterTo='translate-x-0'
                                leave='transition ease-in-out duration-300 transform'
                                leaveFrom='translate-x-0'
                                leaveTo='-translate-x-full'>
                                <Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1'>
                                    <Transition.Child
                                        as={Fragment}
                                        enter='ease-in-out duration-300'
                                        enterFrom='opacity-0'
                                        enterTo='opacity-100'
                                        leave='ease-in-out duration-300'
                                        leaveFrom='opacity-100'
                                        leaveTo='opacity-0'>
                                        <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
                                            <button
                                                type='button'
                                                className='-m-2.5 p-2.5'
                                                onClick={() =>
                                                    setSidebarOpen(false)
                                                }>
                                                <span className='sr-only'>
                                                    Close sidebar
                                                </span>
                                                <XMarkIcon
                                                    className='h-6 w-6 text-white'
                                                    aria-hidden='true'
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* Sidebar component, swap this element with another sidebar if you like */}
                                    <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4'>
                                        <div className='flex h-16 shrink-0 items-center'>
                                            <Image
                                                className='w-auto'
                                                src={Logo}
                                                alt='AGD'
                                                width={256}
                                                height={256}
                                            />
                                        </div>
                                        <nav className='flex flex-1 flex-col'>
                                            <ul
                                                role='list'
                                                className='flex flex-1 flex-col gap-y-7'>
                                                <li>
                                                    <ul
                                                        role='list'
                                                        className='-mx-2 space-y-1'>
                                                        {navigation.map(
                                                            item => (
                                                                <li
                                                                    key={
                                                                        item.name
                                                                    }>
                                                                    <Link
                                                                        href={
                                                                            item.href
                                                                        }
                                                                        className={classNames(
                                                                            item.current
                                                                                ? "bg-custom-blue-bg text-indigo-600"
                                                                                : "text-gray-700 hover:text-indigo-600 hover:bg-custom-blue-bg",
                                                                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                                                        )}>
                                                                        <item.icon
                                                                            className={classNames(
                                                                                item.current
                                                                                    ? "text-indigo-600"
                                                                                    : "text-gray-400 group-hover:text-indigo-600",
                                                                                "h-6 w-6 shrink-0"
                                                                            )}
                                                                            aria-hidden='true'
                                                                        />
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className='flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white '>
                        <div className='flex h-16 p-2 shrink-0 items-center w-[200px]'>
                            <Image
                                className='w-auto'
                                src={Logo}
                                alt='AGD'
                                // layout='fill'
                                objectFit='contain'
                            />
                        </div>
                        <nav className='flex flex-1 flex-col px-6 pb-4'>
                            <ul
                                role='list'
                                className='flex flex-1 flex-col gap-y-7'>
                                <li>
                                    <ul role='list' className='-mx-2 space-y-1'>
                                        {navigation.map(item => (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? "bg-custom-blue-bg text-custom-blue-select"
                                                            : "text-gray-700 hover:text-custom-blue-select hover:bg-custom-blue-bg",
                                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                                    )}>
                                                    <item.icon
                                                        className={classNames(
                                                            item.current
                                                                ? "text-custom-blue-select"
                                                                : "text-gray-400 group-hover:text-custom-blue-select",
                                                            "h-6 w-6 shrink-0"
                                                        )}
                                                        aria-hidden='true'
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className='lg:pl-72'>
                    <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'>
                        <button
                            type='button'
                            className='-m-2.5 p-2.5 text-gray-700 lg:hidden'
                            onClick={() => setSidebarOpen(true)}>
                            <span className='sr-only'>Open sidebar</span>
                            <Bars3Icon className='h-6 w-6' aria-hidden='true' />
                        </button>

                        {/* Separator */}
                        <div
                            className='h-6 w-px bg-gray-200 lg:hidden'
                            aria-hidden='true'
                        />

                        <div className='flex flex-1 gap-x-4 self-stretch lg:gap-x-6'>
                            <div className='relative flex flex-1'></div>

                            <div className='flex items-center gap-x-4 lg:gap-x-6'>
                                {/* Separator */}
                                <div
                                    className='hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200'
                                    aria-hidden='true'
                                />

                                {/* Profile dropdown */}
                                <Menu as='div' className='relative'>
                                    <Menu.Button className='-m-1.5 flex items-center p-1.5'>
                                        <span className='sr-only'>
                                            Open user menu
                                        </span>
                                        <Image
                                            className='h-8 w-auto'
                                            src={LogoRound}
                                            alt='Your Company'
                                            width={32}
                                            height={32}
                                        />
                                        <span className='hidden lg:flex lg:items-center'>
                                            <span
                                                className='ml-4 text-sm font-semibold leading-6 text-gray-900'
                                                aria-hidden='true'>
                                                {
                                                    (session?.user as User)
                                                        ?.fullName
                                                }
                                            </span>
                                            <ChevronDownIcon
                                                className='ml-2 h-5 w-5 text-gray-400'
                                                aria-hidden='true'
                                            />
                                        </span>
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter='transition ease-out duration-100'
                                        enterFrom='transform opacity-0 scale-95'
                                        enterTo='transform opacity-100 scale-100'
                                        leave='transition ease-in duration-75'
                                        leaveFrom='transform opacity-100 scale-100'
                                        leaveTo='transform opacity-0 scale-95'>
                                        <Menu.Items className='absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
                                            {userNavigation.map(item => (
                                                <Menu.Item key={item.name}>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={
                                                                item.onClick
                                                            }
                                                            className={classNames(
                                                                active
                                                                    ? "bg-custom-blue-bg"
                                                                    : "",
                                                                "block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700"
                                                            )}>
                                                            {item.name}
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <main className='py-10'>
                        <div className='px-4 sm:px-6 lg:px-8'>
                            <Card className='bg-white p-10 rounded-2xl shadow-2xl'>
                                {children}
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
            {/* <SidePanel open={open} setOpen={setOpen}>
                <div className='flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl'>
                    <div className='h-0 flex-1 overflow-y-auto p-5'>
                        <ProfileForm userData={user} setOpen={setOpen} />
                    </div>
                </div>
            </SidePanel> */}
        </>
    );
};

export default SideBar;
