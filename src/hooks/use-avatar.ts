import { useMemo } from 'react'

import { Style, Avatar } from '@dicebear/core'
import initials from '@dicebear/styles/initials.json' with { type: 'json' }
import notionistsNeutral from '@dicebear/styles/notionists-neutral.json' with { type: 'json' }
import shapeGrid from '@dicebear/styles/shape-grid.json' with { type: 'json' }

interface Options {
	seed: string
	style: 'initials' | 'notionistsNeutral' | 'shapeGrid'
}

export const useAvatar = ({ seed, style }: Options) => {
	const avatarStyle = useMemo(() => {
		const avatarVariants = {
			initials: new Style(initials),
			notionistsNeutral: new Style(notionistsNeutral),
			shapeGrid: new Style(shapeGrid),
		}

		return avatarVariants[style]
	}, [style])

	const avatar = useMemo(
		() => new Avatar(avatarStyle, { seed }).toDataUri(),
		[seed, avatarStyle]
	)

	return avatar
}
