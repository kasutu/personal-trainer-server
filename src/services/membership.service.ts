import type { Membership, Prisma } from "@prisma/client";
import { Service } from "typedi";
import { prisma } from "~/drivers/prisma";

// Type for Membership with related data
export type MembershipWithServices = Prisma.MembershipGetPayload<{
  include: { services: true };
}>;

export type MembershipWithRelations = Prisma.MembershipGetPayload<{
  include: {
    services: true;
    subscriptions: {
      include: {
        person: true;
      };
    };
    programs: {
      include: {
        creator: true;
      };
    };
  };
}>;

@Service()
export class MembershipService {
  /**
   * Get membership by ID
   */
  async getById(id: number): Promise<Membership | null> {
    return prisma.membership.findUnique({
      where: { id },
    });
  }

  /**
   * Get membership by ID with services
   */
  async getByIdWithServices(
    id: number
  ): Promise<MembershipWithServices | null> {
    return prisma.membership.findUnique({
      where: { id },
      include: {
        services: true,
      },
    });
  }

  /**
   * Get membership by ID with all relations
   */
  async getByIdWithRelations(
    id: number
  ): Promise<MembershipWithRelations | null> {
    return prisma.membership.findUnique({
      where: { id },
      include: {
        services: true,
        subscriptions: {
          include: {
            person: true,
          },
        },
        programs: {
          include: {
            creator: true,
          },
        },
      },
    });
  }

  /**
   * Get all memberships
   */
  async getAll(): Promise<Membership[]> {
    return prisma.membership.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  /**
   * Get all memberships with services
   */
  async getAllWithServices(): Promise<MembershipWithServices[]> {
    return prisma.membership.findMany({
      include: {
        services: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  /**
   * Get membership by name
   */
  async getByName(name: string): Promise<Membership | null> {
    return prisma.membership.findFirst({
      where: {
        name: {
          equals: name,
        },
      },
    });
  }

  /**
   * Create new membership
   */
  async create(data: Prisma.MembershipCreateInput): Promise<Membership> {
    return prisma.membership.create({
      data,
    });
  }

  /**
   * Create membership with services
   */
  async createWithServices(
    membershipData: Omit<Prisma.MembershipCreateInput, "services">,
    services: Array<Omit<Prisma.ServiceCreateInput, "membership">>
  ): Promise<MembershipWithServices> {
    return prisma.membership.create({
      data: {
        ...membershipData,
        services: {
          create: services,
        },
      },
      include: {
        services: true,
      },
    });
  }

  /**
   * Update membership
   */
  async update(
    id: number,
    data: Prisma.MembershipUpdateInput
  ): Promise<Membership> {
    return prisma.membership.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete membership (hard delete)
   * Note: This will cascade delete related services
   */
  async delete(id: number): Promise<Membership> {
    return prisma.membership.delete({
      where: { id },
    });
  }

  /**
   * Check if membership exists
   */
  async exists(id: number): Promise<boolean> {
    const membership = await prisma.membership.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!membership;
  }

  /**
   * Check if membership name is available
   */
  async isNameAvailable(name: string, excludeId?: number): Promise<boolean> {
    const existing = await prisma.membership.findFirst({
      where: {
        name: {
          equals: name,
        },
        ...(excludeId && { id: { not: excludeId } }),
      },
      select: { id: true },
    });
    return !existing;
  }

  /**
   * Get membership statistics
   */
  async getStats(id: number) {
    const [membership, subscriptionStats, programStats] =
      await prisma.$transaction([
        // Get membership details
        prisma.membership.findUnique({
          where: { id },
          include: {
            services: true,
          },
        }),

        // Get subscription statistics
        prisma.memberSubscription.groupBy({
          by: ["status"],
          where: {
            membershipId: id,
          },
          orderBy: {
            status: "asc",
          },
          _count: {
            id: true,
          },
        }),

        // Get program statistics
        prisma.program.count({
          where: {
            membershipId: id,
            isActive: true,
          },
        }),
      ]);

    return {
      membership,
      subscriptions: {
        total: subscriptionStats.reduce(
          (sum, stat) => sum + (stat._count as { id: any }).id,
          0
        ),
        byStatus: subscriptionStats.reduce((acc, stat) => {
          acc[stat.status] = (stat._count as { id: any }).id ?? 0;
          return acc;
        }, {} as Record<string, number>),
      },
      programs: {
        active: programStats,
      },
    };
  }

  /**
   * Get active members count for membership
   */
  async getActiveMembersCount(id: number): Promise<number> {
    return prisma.memberSubscription.count({
      where: {
        membershipId: id,
        status: "ACTIVE",
      },
    });
  }

  /**
   * Search memberships by name or description
   */
  async search(query: string): Promise<Membership[]> {
    return prisma.membership.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
        ],
      },
      orderBy: {
        name: "asc",
      },
    });
  }
}
