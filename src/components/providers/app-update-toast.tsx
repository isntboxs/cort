import { useEffect } from 'react'

import { toast } from 'sonner'
import { useRegisterSW } from 'virtual:pwa-register/react'

const appUpdateToastId = 'app-update-available'
const intervalMS = 60 * 60 * 1000 // 1 hour

export function AppUpdateToast() {
	const {
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegistered(r) {
			if (r) {
				setInterval(() => {
					void r.update()
				}, intervalMS)
			}
		},
	})

	useEffect(() => {
		if (!needRefresh) return

		toast('Update Available', {
			id: appUpdateToastId,
			description:
				'A new version of the app is available. Refresh to get the latest features.',
			duration: Infinity,
			onDismiss: () => {
				setNeedRefresh(false)
			},
			action: {
				label: 'Refresh',
				onClick: () => {
					void updateServiceWorker(true)
				},
			},
			cancel: {
				label: 'Dismiss',
				onClick: () => {
					setNeedRefresh(false)
					toast.dismiss(appUpdateToastId)
				},
			},
		})
	}, [needRefresh, setNeedRefresh, updateServiceWorker])

	return null
}
