import type { TrackingStep } from '../../utils/orderStatus';

interface OrderStatusTimelineProps {
    steps: TrackingStep[];
    status: string;
    cancellationRequested?: boolean;
}

export default function OrderStatusTimeline({
    steps,
    status,
    cancellationRequested
}: OrderStatusTimelineProps) {
    const isCancelled = status === 'cancelled' || status === 'refunded';

    return (
        <div className="rounded-2xl border border-outline-variant/30 bg-surface p-6">
            <h2 className="mb-6 text-lg font-bold text-on-surface">Theo dõi đơn hàng</h2>
            {isCancelled ? (
                <div className="flex items-center gap-3 rounded-xl bg-error/10 px-4 py-3 text-error">
                    <span className="material-symbols-outlined">cancel</span>
                    <span className="font-semibold">Đơn hàng đã bị hủy</span>
                </div>
            ) : (
                <ol className="relative space-y-0">
                    {steps.map((step, index) => {
                        const isLast = index === steps.length - 1;
                        let dotClass = 'bg-surface-container-high border-outline-variant';
                        let textClass = 'text-on-surface-variant';

                        if (step.state === 'completed') {
                            dotClass = 'bg-primary border-primary text-on-primary';
                            textClass = 'text-on-surface';
                        } else if (step.state === 'current') {
                            dotClass = 'bg-primary border-primary ring-4 ring-primary/20';
                            textClass = 'text-primary font-semibold';
                        } else if (step.state === 'warning') {
                            dotClass = 'bg-amber-500 border-amber-500 ring-4 ring-amber-500/20';
                            textClass = 'text-amber-800 font-semibold';
                        }

                        return (
                            <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                                {!isLast && (
                                    <span
                                        className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-0.5 ${
                                            step.state === 'completed' ? 'bg-primary' : 'bg-outline-variant/40'
                                        }`}
                                    />
                                )}
                                <div
                                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${dotClass}`}
                                >
                                    {step.state === 'completed' ? (
                                        <span className="material-symbols-outlined text-[18px]">
                                            check
                                        </span>
                                    ) : step.state === 'warning' ? (
                                        <span className="material-symbols-outlined text-[18px] text-white">
                                            schedule
                                        </span>
                                    ) : (
                                        <span className="h-2 w-2 rounded-full bg-current opacity-40" />
                                    )}
                                </div>
                                <div className="min-w-0 pt-0.5">
                                    <p className={`text-sm ${textClass}`}>{step.label}</p>
                                    <p className="mt-0.5 text-xs text-on-surface-variant">
                                        {step.state === 'warning' && cancellationRequested
                                            ? 'Đã gửi yêu cầu hủy — shop sẽ phản hồi'
                                            : step.description}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            )}
        </div>
    );
}
