// src/components/TableOfContents.tsx
interface TableOfContentsProps {
    items: {
      id: string;
      title: string;
    }[];
  }
  
  const TableOfContents = ({ items }: TableOfContentsProps) => {
    return (
      <div className="my-8 p-6 bg-gray-50 border-l-4 border-red-500 rounded-r-lg">
        <p className="text-xl font-bold mb-4">
          <i className="fa fa-bars mr-2" />
          Danh mục:
        </p>
        {items.map(item => (
          <p key={item.id} className="mb-2">
            <a
              href={`#${item.id}`}
              className="text-gray-700 hover:text-red-500 transition-colors"
            >
              <b>-</b> {item.title}
            </a>
          </p>
        ))}
      </div>
    );
  };
  
  export default TableOfContents;