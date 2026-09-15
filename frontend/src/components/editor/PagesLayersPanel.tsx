import { useEditorStore } from '../../stores/editorStore';
import { cn } from '../../utils/cn';
import { getActivePage, sortElements } from '../../utils/document';
import { elementLabel } from '../../utils/elementStyle';

export function PagesLayersPanel() {
  const documentModel = useEditorStore((s) => s.document);
  const activePageId = useEditorStore((s) => s.activePageId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const setActivePage = useEditorStore((s) => s.setActivePage);
  const addPage = useEditorStore((s) => s.addPage);
  const duplicatePage = useEditorStore((s) => s.duplicatePage);
  const deletePage = useEditorStore((s) => s.deletePage);
  const select = useEditorStore((s) => s.select);
  const reorderPages = useEditorStore((s) => s.reorderPages);

  if (!documentModel) return null;
  const pages = [...documentModel.pages].sort((a, b) => a.order - b.order);
  const page = getActivePage(documentModel, activePageId);
  const layers = page ? [...sortElements(page.elements)].reverse() : [];

  return (
    <aside className="studio-rail flex w-60 flex-col border-r">
      <div className="border-b border-line px-3 py-3">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-paper-muted">
            Páginas
          </h2>
          <button
            type="button"
            className="rounded-md bg-ink-3 px-2 py-1 text-xs font-semibold text-paper transition hover:bg-ink-4"
            onClick={addPage}
          >
            + Página
          </button>
        </div>
        <ul className="max-h-44 space-y-1 overflow-auto scrollbar-thin">
          {pages.map((p, index) => (
            <li key={p.id}>
              <button
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition',
                  p.id === activePageId
                    ? 'bg-accent-soft text-neon ring-1 ring-neon/30'
                    : 'text-paper-muted hover:bg-ink-3 hover:text-paper',
                )}
                onClick={() => setActivePage(p.id)}
              >
                <span>{p.name}</span>
                <span className="flex gap-1">
                  <span
                    className="text-xs opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index > 0) reorderPages(index, index - 1);
                    }}
                    title="Subir"
                  >
                    ↑
                  </span>
                  <span
                    className="text-xs opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index < pages.length - 1) reorderPages(index, index + 1);
                    }}
                    title="Bajar"
                  >
                    ↓
                  </span>
                  <span
                    className="text-xs opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicatePage(p.id);
                    }}
                    title="Duplicar"
                  >
                    ⎘
                  </span>
                  <span
                    className="text-xs opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePage(p.id);
                    }}
                    title="Eliminar"
                  >
                    ×
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 overflow-auto p-3 scrollbar-thin">
        <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-paper-muted">
          Capas
        </h2>
        {layers.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-3 py-6 text-center text-xs text-paper-muted">
            Sin elementos en esta página.
          </p>
        ) : (
          <ul className="space-y-1">
            {layers.map((el) => (
              <li key={el.id}>
                <button
                  type="button"
                  className={cn(
                    'w-full rounded-lg px-2.5 py-2 text-left text-xs transition',
                    selectedIds.includes(el.id)
                      ? 'bg-accent-soft text-neon ring-1 ring-neon/30'
                      : 'text-paper-muted hover:bg-ink-3 hover:text-paper',
                  )}
                  onClick={() => select([el.id])}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate">{elementLabel(el)}</span>
                    <span className="shrink-0 font-mono text-[11px] uppercase opacity-55">
                      {el.type}
                      {el.animation?.preset && el.animation.preset !== 'none' ? ' · ✦' : ''}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
