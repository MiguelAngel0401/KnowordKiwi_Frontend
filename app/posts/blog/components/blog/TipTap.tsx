"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import MenuBar from "./MenuBar";
import { Youtube } from "../../extensions/Youtube";
import { uploadToCloudinary } from "@/services/cloudinary/cloudinaryService";

interface TipTapProps {
  content: string;
  onChange: (richText: string) => void;
}

const Tiptap = ({ content, onChange }: TipTapProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "ml-6 list-disc",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "ml-6 list-decimal",
          },
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({
        multicolor: true,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "mx-auto rounded-lg my-6",
        },
        inline: false,
      }),
      Link.configure({
        HTMLAttributes: {
          class: "text-primary hover:text-primary-hover underline",
        },
        openOnClick: false,
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: "my-6",
        },
        inline: false,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "bg-bg-gray prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] border-b border-secondary py-2 px-4",
      },
      // Handle drag and drop events
      handleDrop: (view, event) => {
        if (!(event instanceof DragEvent) || !event.dataTransfer) {
          return false;
        }

        const files = Array.from(event.dataTransfer.files);
        const imageFiles = files.filter((file) =>
          file.type.startsWith("image/"),
        );

        if (imageFiles.length > 0) {
          event.preventDefault();

          // Upload each image file
          imageFiles.forEach(async (file) => {
            try {
              const imageUrl = await uploadToCloudinary(file);
              // Insert the image at the drop position
              const { schema } = view.state;
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });
              if (coordinates) {
                const node = schema.nodes.image.create({ src: imageUrl });
                const transaction = view.state.tr.insert(coordinates.pos, node);
                view.dispatch(transaction);
              }
            } catch (error) {
              console.error("Error uploading image:", error);
              alert("Error uploading image. Please try again.");
            }
          });

          return true;
        }

        return false;
      },
      // Handle drag over events for visual feedback
      handleDOMEvents: {
        dragover: (view, event) => {
          if (!(event instanceof DragEvent) || !event.dataTransfer) {
            return false;
          }

          const files = Array.from(event.dataTransfer.files);
          const hasImage = files.some((file) => file.type.startsWith("image/"));

          if (hasImage) {
            event.preventDefault();
            setIsDragging(true);
            event.dataTransfer.dropEffect = "copy";
          }

          return false;
        },
        dragleave: () => {
          setIsDragging(false);
          return false;
        },
        drop: () => {
          setIsDragging(false);
          return false;
        },
      },
    },
    onUpdate: ({ editor }) => {
      // Configure DOMPurify to allow YouTube iframes
      const sanitizedContent = DOMPurify.sanitize(editor.getHTML(), {
        ALLOWED_TAGS: [
          "p",
          "br",
          "strong",
          "em",
          "u",
          "ol",
          "ul",
          "li",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "blockquote",
          "pre",
          "code",
          "hr",
          "div",
          "iframe",
          "a",
          "img",
        ],
        ALLOWED_ATTR: [
          "href",
          "src",
          "alt",
          "width",
          "height",
          "class",
          "rel",
          "target",
          "data-youtube-video",
        ],
        ADD_ATTR: ["allowfullscreen"],
        ALLOWED_IFRAME_HOSTNAMES: [
          "www.youtube.com",
          "youtube.com",
          "youtu.be",
        ],
      });
      onChange(sanitizedContent);
    },
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor || editor.isDestroyed) {
      return;
    }

    // Si el contenido del prop es diferente al del editor, actualízalo.
    // Esto sincroniza el estado del editor con el estado del componente padre.
    if (editor.getHTML() !== content) {
      // El `false` como segundo argumento evita que se dispare el evento `onUpdate`
      // y así prevenimos un bucle infinito.
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  return (
    <div className="relative">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      {isDragging && (
        <div className="absolute inset-0 bg-primary/20 border-2 border-dashed border-primary rounded-md flex items-center justify-center pointer-events-none">
          <p className="text-primary font-medium">
            Suelta la imagen aquí para subirla
          </p>
        </div>
      )}
    </div>
  );
};

export default Tiptap;
