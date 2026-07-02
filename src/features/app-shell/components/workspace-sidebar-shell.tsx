import type { ComponentProps, FC } from 'react'

import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar'
import { WorkspaceSidebar } from '#/features/app-shell/components/workspace-sidebar'

type Props = ComponentProps<typeof SidebarProvider>

export const WorkspaceSidebarShell: FC<Props> = ({ children, ...props }) => (
	<SidebarProvider {...props}>
		<WorkspaceSidebar variant="inset" />
		<SidebarInset>{children}</SidebarInset>
	</SidebarProvider>
)
