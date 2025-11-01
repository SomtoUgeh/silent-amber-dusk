import { useInfiniteQuery } from '@tanstack/react-query';
import SingleApplication from './SingleApplication';
import { Button } from './ui/Button/Button';
import { fetchApplications } from './api/applications';

import styles from './Applications.module.css';

const Applications = () => {
	const {
		data: applications,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
	} = useInfiniteQuery({
		queryKey: ['applications'],
		queryFn: ({ pageParam = 1 }) => fetchApplications(pageParam, 5),
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.pagination.hasNextPage
				? allPages.length + 1
				: undefined;
		},
		initialPageParam: 1,
		select: (data) => data.pages.flatMap((page) => page.applications),
	});

	if (isLoading) {
		return (
			<div className={styles.Applications}>
				<div className={styles.loadingMessage}>Loading applications...</div>
			</div>
		);
	}

	if (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error occurred';

		return (
			<div className={styles.Applications}>
				<div className={styles.errorMessage}>Error loading applications: {errorMessage}</div>
			</div>
		);
	}

	return (
		<div className={styles.Applications}>
			{applications?.map((application) => (
				<SingleApplication key={application.id} application={application} />
			))}

			{hasNextPage && (
				<div className={styles.loadMoreContainer}>
					<Button
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage ? 'Loading...' : 'Load more'}
					</Button>
				</div>
			)}
		</div>
	);
};

export default Applications;
