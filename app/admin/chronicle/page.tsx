import { prisma } from "@/lib/prisma";
import { ChronicleFeed } from "@/components/ChronicleFeed";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";
import { ChronicleFilters } from "./ChronicleFilters";

type SearchParams = Promise<{ action?: string; userId?: string }>;

export default async function AdminChroniclePage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const { action, userId } = await searchParams;

    // Формируем условия для фильтрации
    const where: any = {};
    if (action && action !== "all") where.action = action;
    if (userId && userId !== "all") where.userId = Number(userId);

    // Получаем уникальных авторов из логов для выпадающего списка
    const distinctUsers = await prisma.adminLog.findMany({
        select: { user: { select: { id: true, name: true } } },
        distinct: ['userId'],
    });
    const users = distinctUsers.map((u) => u.user);

    // Получаем отфильтрованные логи
    const logs = await prisma.adminLog.findMany({
        where,
        include: { user: { select: { name: true, avatarUrl: true } } },
        orderBy: { createdAt: "desc" },
        take: 100,
    });

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <AdminBreadcrumbs items={[{ label: "Хроника" }]} />
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Хроника событий</h1>
                <p className="text-sm text-muted mt-1">Последние действия в базе данных.</p>
            </div>

            {/* Фильтры */}
            <ChronicleFilters users={users} />

            <ChronicleFeed logs={logs} />
        </div>
    );
}