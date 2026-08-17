import Link from "next/link";

export function Breadcrumb({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {index > 0 && <span aria-hidden>/</span>}
              {isLast ? (
                <span aria-current="page" className="font-medium text-ink">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="transition-colors hover:text-brass-deep">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
