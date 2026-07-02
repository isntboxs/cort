import type { ComponentProps } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { useAvatar } from '#/hooks/use-avatar'
import { cn } from '#/lib/utils'

interface Props extends ComponentProps<typeof Avatar> {
	seed: string
	avatarStyle: Parameters<typeof useAvatar>[0]['style']
}

export const GeneratedAvatar = ({
	seed,
	avatarStyle,
	className,
	...props
}: Props) => {
	const avatarUri = useAvatar({ seed, style: avatarStyle })

	return (
		<Avatar {...props} className={cn(className)}>
			<AvatarImage src={avatarUri} alt={seed} className={cn(className)} />
			<AvatarFallback className={cn('uppercase', className)}>
				{Array.from(seed)[0] ?? '?'}
			</AvatarFallback>
		</Avatar>
	)
}
