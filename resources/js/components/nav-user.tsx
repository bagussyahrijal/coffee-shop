import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDown, LogIn, UserPlus } from 'lucide-react';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    // Jika user tidak login, tampilkan opsi login dan register
    if (!auth.user) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className="space-y-2">
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href="/login"
                                className="group text-sidebar-accent-foreground hover:bg-sidebar-accent justify-center"
                            >
                                <LogIn className="h-4 w-4" />
                                <span className="font-semibold">Sign In</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href="/register"
                                className="group text-sidebar-accent-foreground hover:bg-sidebar-accent justify-center"
                            >
                                <UserPlus className="h-4 w-4" />
                                <span className="font-semibold">Register</span>
                            </Link>
                        </SidebarMenuButton>
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    // Jika user sudah login, tampilkan dropdown menu
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'bottom'
                        }
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
