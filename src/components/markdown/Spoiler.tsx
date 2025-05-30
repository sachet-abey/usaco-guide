import React from 'react';

export interface SpoilerProps {
  title: string;
  /**
   * Whether or not the spoiler should start expanded.
   * Defaults to false.
   */
  startExpanded?: boolean;
  children?: React.ReactNode;
}

export const SpoilerContext = React.createContext<{
  /**
   * If true, code blocks should be expanded by default. This is the case if
   * the spoiler's only child is a code block, which means that the code block
   * should just always be expanded.
   */
  expandCodeBlock: boolean;
}>({
  expandCodeBlock: false,
});

const Spoiler = ({
  children,
  title,
  startExpanded = false,
}: SpoilerProps): JSX.Element => {
  const [show, setShow] = React.useState(startExpanded);

  let expandCodeBlock = false;
  const arrChildren = React.Children.toArray(children);
  if (
    arrChildren.length === 1 &&
    (arrChildren[0] as any).type?.name === 'pre'
  ) {
    expandCodeBlock = true;
  } else if (
    arrChildren.length === 1 &&
    (arrChildren[0] as any).type?.name === 'LanguageSection'
  ) {
    // note: this should ideally check each language section to make sure it only has one child
    expandCodeBlock = true;
  }

  return (
    <div
      className={`mb-4 rounded-md border border-gray-100 bg-gray-50 dark:border-transparent dark:bg-gray-800/50`}
    >
      <p
        className="flex items-start p-4"
        onClick={e => {
          setShow(!show);
        }}
        style={{ marginBottom: 0 }}
      >
        {show && (
          <svg
            className="mr-4 h-6 w-6 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {!show && (
          <svg
            className="mr-4 h-6 w-6 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <span className="flex-1">{title}</span>
      </p>

      {show && (
        <div className="spoiler-body dark:bg-dark-surface/40 no-y-margin bg-white p-4">
          <SpoilerContext.Provider value={{ expandCodeBlock }}>
            {children}
          </SpoilerContext.Provider>
        </div>
      )}
    </div>
  );
};

export default Spoiler;
