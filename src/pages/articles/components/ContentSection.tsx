// src/components/ContentSection.tsx
interface ContentSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const ContentSection = ({ id, title, children }: ContentSectionProps) => {
  return (
    <section id={id} className="mb-12">
      <h2 className="text-2xl font-bold text-red-600 mb-6">{title}</h2>
      <div className="prose max-w-none">{children}</div>
    </section>
  );
};

export default ContentSection;
