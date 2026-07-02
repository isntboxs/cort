import type { ComponentProps, FC } from 'react'

import { SidebarHeader } from '#/components/ui/sidebar'
import { WorkspaceSwitcherSidebar } from '#/features/app-shell/components/workspace-switcher-sidebar'

type Props = ComponentProps<typeof SidebarHeader>

export const WorkspaceSidebarHeader: FC<Props> = (props) => (
	<SidebarHeader {...props}>
		<WorkspaceSwitcherSidebar />
	</SidebarHeader>
)
