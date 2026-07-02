import type { ComponentProps, FC } from 'react'

import { Sidebar } from '#/components/ui/sidebar'
import { WorkspaceSidebarHeader } from '#/features/app-shell/components/workspace-sidebar-header'

type Props = ComponentProps<typeof Sidebar>

export const WorkspaceSidebar: FC<Props> = (props) => (
	<Sidebar {...props}>
		<WorkspaceSidebarHeader />
	</Sidebar>
)
