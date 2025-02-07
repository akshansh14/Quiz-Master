function ReadingMaterialDialog({ content }) {
    if (!content || !content.content_sections) {
      return null
    }
  
    return (
    //   <Dialog>
    //     <DialogTrigger asChild>
    //       <button className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors">
    //         <BookOpen className="w-4 h-4 mr-2" />
    //         Study Material
    //       </button>
    //     </DialogTrigger>
    //     <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
    //       <DialogHeader>
    //         <DialogTitle>Study Material</DialogTitle>
    //       </DialogHeader>
    //       <div className="mt-4 space-y-4">
    //         {content.content_sections.map((section, index) => (
    //           <div 
    //             key={index} 
    //             className="prose prose-blue max-w-none"
    //             dangerouslySetInnerHTML={{ __html: section }}
    //           />
    //         ))}
    //       </div>
    //     </DialogContent>
    //   </Dialog>
    <>
    
    </>
    )
  }

  export default ReadingMaterialDialog;