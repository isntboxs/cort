import { getRouteApi } from '@tanstack/react-router'

import { IconCheck, IconChevronDown, IconPlus } from '@tabler/icons-react'

import { GeneratedAvatar } from '#/components/generated-avatar'
import {
	useGetFullWorkspace,
	useListWorkspaces,
} from '#/features/workspace/api'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'

const routeApi = getRouteApi('/_protected/$workspaceSlug')

export const WorkspaceSwitcherSidebar = () => {
	const params = routeApi.useParams()
	const { auth } = routeApi.useRouteContext()

	const { data: workspace } = useGetFullWorkspace({
		workspaceSlug: params.workspaceSlug,
	})
	const { data: listWorkspace } = useListWorkspaces()

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="w-fit px-1.5">
							<GeneratedAvatar
								seed={workspace.name}
								avatarStyle="shapeGrid"
								className="size-5 rounded-md after:border-0"
							/>

							<span className="truncate font-medium">{workspace.name}</span>

							<IconChevronDown className="opacity-50" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="w-64 rounded-lg"
						align="start"
						side="bottom"
						sideOffset={4}
					>
						<DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
						{listWorkspace.map((w) => (
							<DropdownMenuItem key={w.id}>
								<GeneratedAvatar
									seed={w.name}
									avatarStyle="shapeGrid"
									className="size-5 rounded-md after:border-0"
								/>

								<span className="truncate font-medium">{w.name}</span>

								{w.id === auth.session.activeOrganizationId && (
									<DropdownMenuShortcut>
										<IconCheck />
									</DropdownMenuShortcut>
								)}
							</DropdownMenuItem>
						))}

						<DropdownMenuSeparator />

						<DropdownMenuItem>
							<IconPlus />
							<span className="truncate font-medium">Create workspace</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
