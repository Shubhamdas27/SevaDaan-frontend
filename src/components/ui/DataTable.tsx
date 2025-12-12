import React from 'react';
import { cn } from '../../lib/utils';

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (row: T, index: number) => void;
  stickyHeader?: boolean;
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
}

const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  className,
  emptyMessage = 'No data available',
  loading = false,
  onRowClick,
  stickyHeader = false,
  striped = false,
  hover = true,
  compact = false,
  ...props
}: DataTableProps<T>) => {
  const renderCellContent = (column: TableColumn<T>, row: T, index: number) => {
    if (column.render) {
      return column.render(row[column.key], row, index);
    }
    return row[column.key];
  };

  const LoadingSkeleton = () => (
    <tr>
      {columns.map((_, index) => (
        <td key={index} className={cn('px-6 py-4', compact && 'px-4 py-2')}>
          <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className={cn('overflow-hidden border border-gray-200 rounded-lg', className)} {...props}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={cn('bg-gray-50', stickyHeader && 'sticky top-0 z-10')}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    compact && 'px-4 py-2',
                    column.className,
                    column.sortable && 'cursor-pointer hover:bg-gray-100',
                    column.width && `datatable-col-width-${column.key}`
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={cn('bg-white divide-y divide-gray-200', striped && 'divide-gray-100')}>
            {loading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length}
                  className={cn('px-6 py-12 text-center text-gray-500', compact && 'px-4 py-8')}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((row, index) => (
                <tr
                  key={index}
                  className={cn(
                    striped && index % 2 === 1 && 'bg-gray-50',
                    hover && 'hover:bg-gray-50',
                    onRowClick && 'cursor-pointer',
                    'transition-colors duration-150'
                  )}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                        compact && 'px-4 py-2',
                        column.className
                      )}
                    >
                      {renderCellContent(column, row, index) as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

DataTable.displayName = 'DataTable';

export { DataTable };
