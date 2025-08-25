"use client";
import * as React from "react";
import {
    FilePlus,
    FileText,
    Building2,
    UsersRound,
    LayoutDashboard,
    Workflow,
    GlobeLock,
} from "lucide-react";

import UserNav from "./ui/navigation/UserNav";
import NavList from "@/components/ui/navigation/NavList";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect } from "react";
import { redirect, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface LayoutProps {
    defaultLayout: number[] | undefined;
    defaultCollapsed?: boolean;
    navCollapsedSize: number;
    children?: React.ReactNode; // Add this line
}

const Layout: React.FC<LayoutProps> = ({
    defaultLayout = [265, 440, 655],
    defaultCollapsed = false,
    navCollapsedSize,
    children,
}) => {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/api/auth/signin?callbackUrl=/");
        },
    });
    const user = {
        name: session?.user?.name,
        email: session?.user?.email,
        imageUrl:
            "https://icon-library.com/images/default-profile-icon/default-profile-icon-17.jpg",
    };
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
    const currentPath = usePathname();
    const [pageTitle, setPageTitle] = React.useState("");
    useEffect(() => {
        if (currentPath === "/") {
            setPageTitle("Dashboard");
        } else if (currentPath.includes("/companies")) {
            setPageTitle("Companies");
        } else if (currentPath.includes("/users")) {
            setPageTitle("Users");
        } else if (currentPath.includes("/template/unknown")) {
            setPageTitle("Unknown RPA Template");
        } else if (currentPath === "/template") {
            setPageTitle("RPA Template");
        }
    }, [currentPath]);
    return (
        <TooltipProvider delayDuration={0}>
            <ResizablePanelGroup
                direction='horizontal'
                onLayout={(sizes: number[]) => {
                    document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                        sizes
                    )}`;
                }}
                className='h-full items-stretch'>
                <ResizablePanel
                    defaultSize={defaultLayout[0]}
                    collapsedSize={navCollapsedSize}
                    collapsible={true}
                    minSize={15}
                    maxSize={20}
                    onCollapse={() => {
                        setIsCollapsed(true);
                        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                            true
                        )}`;
                    }}
                    onExpand={() => {
                        setIsCollapsed(false);
                        document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                            false
                        )}`;
                    }}
                    className={cn(
                        isCollapsed &&
                            "min-w-[50px] transition-all duration-300 ease-in-out"
                    )}>
                    <div
                        className={cn(
                            "flex h-[52px] items-center justify-center",
                            isCollapsed ? "h-[52px]" : "px-2"
                        )}></div>

                    <NavList
                        isCollapsed={isCollapsed}
                        links={[
                            {
                                title: "Dashboard",
                                label: "",
                                icon: LayoutDashboard,
                                isActive:
                                    currentPath === "/" || currentPath === "",
                                link: "/",
                            },
                        ]}
                    />
                    <Separator />
                    <NavList
                        isCollapsed={isCollapsed}
                        links={[
                            {
                                title: "Companies",
                                label: "",
                                icon: Building2,
                                isActive: currentPath.includes("/companies"),
                                link: "/companies",
                            },
                            {
                                title: "Users",
                                label: "",
                                icon: UsersRound,
                                isActive: currentPath.includes("/users"),
                                link: "/users",
                            },
                        ]}
                    />
                    <Separator />
                    {/* <NavList
                        isCollapsed={isCollapsed}
                        links={[
                            {
                                title: "Unknown RPA Template",
                                label: "",
                                icon: FilePlus,
                                isActive:
                                    currentPath.includes("/template/unknown"),
                                link: "/template/unknown",
                            },
                            {
                                title: "RPA Template",
                                label: "",
                                icon: FileText,
                                isActive: currentPath === "/template",
                                link: "/template",
                            },
                        ]}
                    />
                    <Separator /> */}
                    <NavList
                        isCollapsed={isCollapsed}
                        links={[
                            // {
                            //     title: "My Dokmee ECM",
                            //     label: "",
                            //     icon: GlobeLock,
                            //     isActive:
                            //         currentPath.includes("/ecm/connection"),
                            //     link: "/ecm/connection",
                            // },
                            {
                                title: "Workflow automation",
                                label: "",
                                icon: Workflow,
                                isActive: currentPath.includes("/ecm/workflow"),
                                link: "/ecm/workflow",
                            },
                        ]}
                    />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                    <Tabs defaultValue='all'>
                        <div className='flex items-center px-4 py-2'>
                            <h2 className='text-3xl font-bold tracking-tight'>
                                {pageTitle}
                            </h2>
                            <div className='ml-auto'>
                                <UserNav
                                    email={user.email || ""}
                                    name={user.name || ""}
                                />
                            </div>
                        </div>
                        <Separator />
                        <TabsContent
                            value='all'
                            className='m-0 px-4 py-2 bg-gray-100 h-screen'>
                            {children}
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>
    );
};

export default Layout;
