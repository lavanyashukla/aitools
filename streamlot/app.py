import streamlit as st
from streamlit.components.v1.html import HtmlPage

# Constants
TAILWIND_CLASSES = {
    'container': 'flex justify-center items-center h-screen bg-zinc-100 dark:bg-zinc-900',
    'node': 'node bg-pink-500 text-white p-4 rounded-full cursor-pointer text-center m-4',
}

# Node component
def Node(name):
    return st.markdown(f'<div class="{TAILWIND_CLASSES["node"]}">{name}</div>', unsafe_allow_html=True)

# Mind Map component
class MindMap:
    def __init__(self):
        self.nodes = {
            'AI Tools': ['UI', 'Summarization', 'RAG'],
            'UI': ['Design', 'Prototyping', 'Testing'],
            'Summarization': ['Text', 'Video', 'Audio'],
            'RAG': ['Retrieval', 'Augmentation', 'Generation']
        }
        self.current_nodes = ['AI Tools']

    def render(self):
        with st.container():
            st.markdown(f'<div class="{TAILWIND_CLASSES["container"]}">', unsafe_allow_html=True)
            for node_name in self.current_nodes:
                Node(node_name)
            st.markdown('</div>', unsafe_allow_html=True)

    def on_node_click(self, name):
        self.current_nodes = self.nodes.get(name, [])
        self.render()

# Create the Mind Map component
mind_map = MindMap()

# Initial render
mind_map.render()

# Add event listeners to nodes
for node_name in mind_map.current_nodes:
    st.button(node_name, on_click=mind_map.on_node_click, args=(node_name,))
