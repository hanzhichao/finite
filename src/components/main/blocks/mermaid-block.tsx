import { createReactBlockSpec } from "@blocknote/react";
import mermaid from "mermaid";
import React, { useEffect, useRef, useId } from "react";
import { useTheme } from "next-themes";
import { ListTree } from "lucide-react";

export const MermaidBlock = createReactBlockSpec(
  {
    type: "mermaid",
    propSchema: {
      code: {
        default: "graph TD;\n    A-->B;\n    A-->C;\n    B-->D;\n    C-->D;",
      },
      editing: {
        default: "true",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const { resolvedTheme } = useTheme();
      const containerRef = useRef<HTMLDivElement>(null);
      const uuid = useId().replace(/[:\.\-]/g, "");

      useEffect(() => {
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === "dark" ? "dark" : "default",
          securityLevel: "loose",
        });

        if (containerRef.current && props.block.props.editing === "false") {
          const renderMermaid = async () => {
            containerRef.current!.innerHTML = "";
            try {
              if (!props.block.props.code.trim()) {
                containerRef.current!.innerHTML = '<div style="color: gray">Empty Diagram</div>';
                return;
              }
              const { svg } = await mermaid.render(`mermaid-${uuid}`, props.block.props.code);
              if (containerRef.current) {
                containerRef.current.innerHTML = svg;
              }
            } catch (e: any) {
              if (containerRef.current) {
                containerRef.current.innerHTML = `<div style="color: #ff4b4b; background:#ffe6e6; padding: 1rem; border-radius: 4px;">Syntax Error: ${e.message}</div>`;
              }
            }
          }
          renderMermaid();
        }
      }, [props.block.props.code, props.block.props.editing, resolvedTheme]);

      const isEditing = props.block.props.editing === "true";

      return (
        <div style={{ width: "100%", padding: "0.5rem", borderRadius: "0.5rem", backgroundColor: "var(--mantine-color-gray-1)", marginBottom: "0.5rem", position: "relative" }}>
          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <textarea
                value={props.block.props.code}
                onChange={(e) =>
                  props.editor.updateBlock(props.block, {
                    type: "mermaid",
                    props: { code: e.target.value },
                  })
                }
                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid var(--mantine-color-gray-3)", fontFamily: "monospace", minHeight: "120px" }}
                placeholder="Enter Mermaid code (e.g. graph TD...)"
                rows={5}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    props.editor.updateBlock(props.block, {
                      type: "mermaid",
                      props: { editing: "false" },
                    });
                  }
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() =>
                    props.editor.updateBlock(props.block, {
                      type: "mermaid",
                      props: { editing: "false" },
                    })
                  }
                  style={{ padding: "0.25rem 0.5rem", backgroundColor: "var(--mantine-color-blue-filled)", color: "white", borderRadius: "0.25rem", fontSize: "0.875rem", cursor: "pointer", border: "none" }}
                >
                  Render (⌘+Enter)
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{ cursor: props.editor.isEditable ? "pointer" : "default", minHeight: "2rem", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}
              onDoubleClick={(e) => {
                if (props.editor.isEditable && (e.target as HTMLElement).tagName !== "A") { // don't intercept mermaid links
                  props.editor.updateBlock(props.block, {
                    type: "mermaid",
                    props: { editing: "true" },
                  });
                }
              }}
            >
              <div ref={containerRef} style={{ width: "100%", display: "flex", justifyContent: "center" }} />
            </div>
          )}
        </div>
      );
    },
  }
);
