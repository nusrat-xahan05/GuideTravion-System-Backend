export interface IAdminDashboardStats {
    totalGuides: number;
    totalTourists: number;

    totalTours: number;
    approvedTours: number;
    pendingTours: number;
    rejectedTours: number;

    totalBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
}
