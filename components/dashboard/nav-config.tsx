import {
  Home,
  LayoutDashboard,
  CalendarDays,
  Boxes,
  Tags,
  ClipboardList,
  CalendarCheck2,
  ClipboardCheck,
  BarChart3,
  FileDown,
  Building2,
  MapPinned,
  Users,
  ShieldCheck,
  Settings,
  CreditCard,
  Globe2,
  Landmark,
  Swords,
  LifeBuoy,
  HelpCircle,
  Library,
  Search,
  BookUp,
  FileStack,
  BookMarked,
  BookCopy,
  Layers,
  FolderTree,
  MonitorPlay,
  UserCheck,
  Brain,
  UserCog,
  Award,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import type { Permission } from "@/lib/permissions";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission | Permission[]; // visible si l'une des permissions est accordée
  badge?: "pending" | "notifications" | "libraryReview" | "accountRequests";
  exact?: boolean;
}

export interface NavSection {
  title?: string;
  icon: LucideIcon; // icône caractéristique de la catégorie (rail replié)
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Principal",
    icon: LayoutDashboard,
    items: [
      { label: "Accueil", href: "/", icon: Home, exact: true },
      { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard, exact: true },
      { label: "Calendrier", href: "/dashboard/calendar", icon: CalendarDays, permission: "calendar.read" },
      { label: "Salles multimédias", href: "/dashboard/rooms", icon: MonitorPlay, permission: "resources.read" },
      { label: "Mes réservations", href: "/dashboard/bookings/my", icon: CalendarCheck2, permission: "bookings.read_own" },
      { label: "Sport cérébral", href: "/dashboard/sport-cerebral", icon: Brain },
      { label: "Espace formation", href: "/formation", icon: GraduationCap },
      { label: "Formation CERTEL", href: "/certel", icon: Award },
      { label: "Mon compte", href: "/dashboard/account", icon: UserCog },
    ],
  },
  {
    title: "Gestion",
    icon: Boxes,
    items: [
      { label: "Ressources", href: "/dashboard/resources", icon: Boxes, permission: "resources.read" },
      { label: "Catégories", href: "/dashboard/resource-categories", icon: Tags, permission: "resource_categories.manage" },
      { label: "Réservations", href: "/dashboard/bookings", icon: ClipboardList, permission: "bookings.read_all", exact: true },
      { label: "À valider", href: "/dashboard/bookings/pending", icon: ClipboardCheck, permission: "bookings.validate", badge: "pending" },
      { label: "Statistiques", href: "/dashboard/statistics", icon: BarChart3, permission: "statistics.read" },
      { label: "Rapports", href: "/dashboard/reports", icon: FileDown, permission: "reports.export" },
      { label: "Compétitions", href: "/dashboard/competitions", icon: Swords, permission: ["platform.manage", "organization.manage"] },
    ],
  },
  {
    title: "Bibliothèque",
    icon: Library,
    items: [
      { label: "Bibliothèque", href: "/dashboard/library", icon: Library, permission: "documents.read", exact: true },
      { label: "Explorer", href: "/dashboard/library/explore", icon: Search, permission: "documents.read" },
      { label: "Déposer", href: "/dashboard/library/deposit", icon: BookUp, permission: "documents.create" },
      { label: "Documents", href: "/dashboard/library/documents", icon: FileStack, permission: "documents.read" },
      { label: "À vérifier", href: "/dashboard/library/review", icon: ClipboardCheck, permission: "documents.review", badge: "libraryReview" },
      { label: "Réservations doc.", href: "/dashboard/library/reservations", icon: BookMarked, permission: "documents.reserve" },
      { label: "Emprunts", href: "/dashboard/library/loans", icon: BookCopy, permission: "documents.review" },
      { label: "Statistiques doc.", href: "/dashboard/library/statistics", icon: BarChart3, permission: "library.statistics" },
      { label: "Collections", href: "/dashboard/library/collections", icon: Layers, permission: "library.manage" },
      { label: "Domaines", href: "/dashboard/library/domains", icon: FolderTree, permission: "library.manage" },
    ],
  },
  {
    title: "Administration",
    icon: ShieldCheck,
    items: [
      { label: "Organisation", href: "/dashboard/admin/organization", icon: Building2, permission: "organization.manage" },
      { label: "Sites & services", href: "/dashboard/admin/sites", icon: MapPinned, permission: "sites.manage" },
      { label: "Utilisateurs", href: "/dashboard/admin/users", icon: Users, permission: "users.manage" },
      { label: "Demandes de comptes", href: "/dashboard/admin/account-requests", icon: UserCheck, permission: "users.manage", badge: "accountRequests" },
      { label: "Rôles & permissions", href: "/dashboard/admin/roles", icon: ShieldCheck, permission: "roles.manage" },
      { label: "Certificats", href: "/dashboard/admin/certificates", icon: Award, permission: "users.manage" },
      { label: "Paramètres", href: "/dashboard/admin/settings", icon: Settings, permission: "settings.manage" },
      { label: "Abonnement", href: "/dashboard/admin/subscription", icon: CreditCard, permission: "organization.manage" },
    ],
  },
  {
    title: "Plateforme",
    icon: Globe2,
    items: [
      { label: "Supervision EduWeb", href: "/dashboard/platform", icon: Globe2, permission: "platform.manage", exact: true },
      { label: "Gouvernement & ministères", href: "/dashboard/platform/government", icon: Landmark, permission: "platform.manage" },
      { label: "Établissements", href: "/dashboard/platform/organizations", icon: Building2, permission: "platform.manage" },
      { label: "Réglages des jeux", href: "/dashboard/platform/jeux", icon: Brain, permission: "platform.manage" },
      { label: "Diagnostics CERTEL", href: "/dashboard/platform/certel", icon: GraduationCap, permission: "platform.manage" },
      { label: "Tarifs CERTEL", href: "/dashboard/platform/certel-tarifs", icon: CreditCard, permission: "platform.manage" },
      { label: "Évaluations", href: "/dashboard/platform/evaluations", icon: ClipboardCheck, permission: "platform.manage" },
      { label: "Sécurité & sessions", href: "/dashboard/platform/securite", icon: ShieldCheck, permission: "platform.manage" },
    ],
  },
  {
    title: "Aide",
    icon: LifeBuoy,
    items: [
      { label: "Formation", href: "/dashboard/training", icon: GraduationCap },
      { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
      { label: "Centre d'aide", href: "/dashboard/help", icon: HelpCircle },
    ],
  },
];
