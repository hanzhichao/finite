import { createReactBlockSpec } from "@blocknote/react";
import katex from "katex";
import "katex/dist/katex.min.css";
import React, { useEffect, useRef } from "react";
import { Calculator } from "lucide-react";

export const MathBlock = createReactBlockSpec(
  {
    type: "math",
    propSchema: {
      equation: {
        default: "E=mc^2",
      },
      editing: {
        default: "true",
      },
    },
    content: "none",
  },
  {
    render: (props) => {
      const containerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (containerRef.current && props.block.props.editing === "false") {
          try {
            containerRef.current.innerHTML = "";
            katex.render(props.block.props.equation || "", containerRef.current, {
              throwOnError: false,
              displayMode: true,
            });
          } catch (e) {
            console.error(e);
          }
        }
      }, [props.block.props.equation, props.block.props.editing]);

      const isEditing = props.block.props.editing === "true";

      return (
        <div style={{ width: "100%", padding: "0.5rem", borderRadius: "0.5rem", backgroundColor: "var(--mantine-color-gray-1)", marginBottom: "0.5rem" }}>
          {isEditing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--mantine-color-dimmed)", fontSize: "0.875rem" }}>
                <Calculator size={16} />
                <span>KaTeX Equation</span>
              </div>
              <textarea
                value={props.block.props.equation}
                onChange={(e) =>
                  props.editor.updateBlock(props.block, {
                    type: "math",
                    props: { equation: e.target.value },
                  })
                }
                style={{ width: "100%", padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid var(--mantine-color-gray-3)", fontFamily: "monospace", minHeight: "80px" }}
                placeholder="Enter LaTeX equation"
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    props.editor.updateBlock(props.block, {
                      type: "math",
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
                      type: "math",
                      props: { editing: "false" },
                    })
                  }
                  style={{ padding: "0.25rem 0.5rem", backgroundColor: "var(--mantine-color-blue-filled)", color: "white", borderRadius: "0.25rem", fontSize: "0.875rem", cursor: "pointer", border: "none" }}
                >
                  Save (Enter)
                </button>
              </div>
            </div>
          ) : (
            <div
              onDoubleClick={() => {
                if (props.editor.isEditable) {
                  props.editor.updateBlock(props.block, {
                    type: "math",
                    props: { editing: "true" },
                  });
                }
              }}
              style={{ cursor: props.editor.isEditable ? "pointer" : "default", minHeight: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <div ref={containerRef} />
              {!props.block.props.equation && <div style={{color: "gray"}}>Empty Equation</div>}
            </div>
          )}
        </div>
      );
    },
  }
);
