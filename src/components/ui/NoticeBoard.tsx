import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Icons } from '../icons';
import { Notice } from '../../types';
import { formatDate } from '../../lib/utils';

export interface NoticeBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  notices: Notice[];
  maxHeight?: string;
  autoScroll?: boolean;
}

const NoticeBoard = React.forwardRef<HTMLDivElement, NoticeBoardProps>(
  ({ className, notices, maxHeight = '300px', autoScroll = true, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (!autoScroll || notices.length <= 1) return;

      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % notices.length);
      }, 5000);

      return () => clearInterval(intervalId);
    }, [autoScroll, notices.length]);

    const getIcon = (type: Notice['type']) => {
      switch (type) {
        case 'event':
          return <Icons.calendar className="w-4 h-4" />;
        case 'scheme':
          return <Icons.externalLink className="w-4 h-4" />;
        case 'announcement':
          return <Icons.notification className="w-4 h-4" />;
        default:
          return <Icons.notification className="w-4 h-4" />;
      }
    };

    return (
      <div
        className={cn(
          'bg-white rounded-lg shadow-sm border border-slate-200',
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 rounded-t-lg">
          <h3 className="text-sm font-medium flex items-center">
            <Icons.notification className="w-4 h-4 mr-2 text-blue-500" />
            Notice Board
          </h3>
        </div>
        <div
          className="overflow-y-auto"
          style={{ maxHeight }}
        >
          {notices.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-sm">
              No notices available
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notices.map((notice, index) => (
                <div
                  key={notice.id}
                  className={cn(
                    'p-4 transition-colors',
                    notice.isHighlighted ? 'bg-blue-50' : '',
                    index === currentIndex && autoScroll ? 'bg-blue-50' : ''
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0 text-blue-500">
                      {getIcon(notice.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">
                        {notice.url ? (
                          <a
                            href={notice.url}
                            className="text-blue-600 hover:underline"
                            target={notice.type === 'scheme' ? '_blank' : undefined}
                            rel={notice.type === 'scheme' ? 'noopener noreferrer' : undefined}
                          >
                            {notice.title}
                          </a>
                        ) : (
                          notice.title
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{notice.content}</p>
                      {notice.startDate && (
                        <p className="text-xs text-slate-400 mt-1 flex items-center">
                          <Icons.calendar className="w-3 h-3 mr-1" />
                          {formatDate(notice.startDate, 'MMM d, yyyy')}
                          {notice.endDate && ` - ${formatDate(notice.endDate, 'MMM d, yyyy')}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

NoticeBoard.displayName = 'NoticeBoard';

export { NoticeBoard };
export type { Notice };