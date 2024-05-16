<div class="flex items-center justify-between p-4 bg-zinc-200 dark:bg-zinc-800 w-full">
  <div class="flex items-center">
    <img src="https://placehold.co/50x50" alt="AITOOLS logo" class="mr-2">
    <span class="font-helvetica text-2xl font-bold text-zinc-900 dark:text-zinc-100">AITOOLS</span>
  </div>
</div>
<div id="mindmap" class="flex flex-wrap items-center justify-center min-h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 gap-4 p-4">
  <div id="main-node" class="card bg-pink-200 text-pink-900 p-4 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 w-32 h-32 flex items-center justify-center animate-pulse">
    <div class="front">
      <h2 class="text-xl font-bold">Main Node</h2>
    </div>
    <div class="back hidden">
      <p class="text-sm">This is the main node description.</p>
    </div>
  </div>
  <button id="back-button" class="hidden bg-red-500 text-white p-2 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105">Back</button>
</div>
<script>
  const mindmapData = {
    title: "Main Node",
    description: "This is the main node description.",
    subnodes: [
      {
        title: "Subnode 1",
        description: "Description for Subnode 1",
        subnodes: [
          {
            title: "Subnode 1.1",
            description: "Description for Subnode 1.1",
            link: "#"
          },
          {
            title: "Subnode 1.2",
            description: "Description for Subnode 1.2",
            link: "#"
          }
        ]
      },
      {
        title: "Subnode 2",
        description: "Description for Subnode 2",
        subnodes: [
          {
            title: "Subnode 2.1",
            description: "Description for Subnode 2.1",
            link: "#"
          }
        ]
      }
    ]
  };

  const mindmapContainer = document.getElementById('mindmap');
  const mainNode = document.getElementById('main-node');
  const backButton = document.getElementById('back-button');
  let previousNodes = [];

  mainNode.addEventListener('click', () => {
    previousNodes.push(mindmapContainer.innerHTML);
    renderNodes(mindmapData.subnodes);
    mainNode.remove();
    backButton.classList.remove('hidden');
  });

  mainNode.addEventListener('mouseover', () => {
    mainNode.querySelector('.front').classList.add('hidden');
    mainNode.querySelector('.back').classList.remove('hidden');
  });

  mainNode.addEventListener('mouseout', () => {
    mainNode.querySelector('.front').classList.remove('hidden');
    mainNode.querySelector('.back').classList.add('hidden');
  });

  backButton.addEventListener('click', () => {
    if (previousNodes.length > 0) {
      mindmapContainer.innerHTML = previousNodes.pop();
      if (previousNodes.length === 0) {
        backButton.classList.add('hidden');
      }
      attachEventListeners();
    }
  });

  function renderNodes(nodes) {
    mindmapContainer.innerHTML = ''; // Clear existing nodes
    nodes.forEach(node => {
      const nodeElement = document.createElement('div');
      nodeElement.className = 'card bg-green-200 text-green-900 p-4 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 w-32 h-32 flex items-center justify-center animate-pulse';
      nodeElement.innerHTML = `
        <div class="front">
          <h2 class="text-xl font-bold">${node.title}</h2>
        </div>
        <div class="back hidden">
          <p class="text-sm">${node.description}</p>
        </div>
      `;
      nodeElement.addEventListener('click', () => {
        if (node.subnodes) {
          previousNodes.push(mindmapContainer.innerHTML);
          renderNodes(node.subnodes);
        } else {
          window.location.href = node.link;
        }
        nodeElement.remove();
      });
      nodeElement.addEventListener('mouseover', () => {
        nodeElement.querySelector('.front').classList.add('hidden');
        nodeElement.querySelector('.back').classList.remove('hidden');
      });
      nodeElement.addEventListener('mouseout', () => {
        nodeElement.querySelector('.front').classList.remove('hidden');
        nodeElement.querySelector('.back').classList.add('hidden');
      });
      mindmapContainer.appendChild(nodeElement);
    });
  }

  function attachEventListeners() {
    document.querySelectorAll('.card').forEach(nodeElement => {
      nodeElement.addEventListener('click', () => {
        const nodeTitle = nodeElement.querySelector('.front h2').innerText;
        const node = findNodeByTitle(mindmapData, nodeTitle);
        if (node.subnodes) {
          previousNodes.push(mindmapContainer.innerHTML);
          renderNodes(node.subnodes);
        } else {
          window.location.href = node.link;
        }
        nodeElement.remove();
      });
      nodeElement.addEventListener('mouseover', () => {
        nodeElement.querySelector('.front').classList.add('hidden');
        nodeElement.querySelector('.back').classList.remove('hidden');
      });
      nodeElement.addEventListener('mouseout', () => {
        nodeElement.querySelector('.front').classList.remove('hidden');
        nodeElement.querySelector('.back').classList.add('hidden');
      });
    });
  }

  function findNodeByTitle(data, title) {
    if (data.title === title) return data;
    for (const subnode of data.subnodes || []) {
      const result = findNodeByTitle(subnode, title);
      if (result) return result;
    }
    return null;
  }
</script>
<style>
  .card {
    perspective: 1000px;
  }
  .card .front, .card .back {
    backface-visibility: hidden;
    transition: transform 0.6s;
  }
  .card .back {
    transform: rotateY(180deg);
  }
  .card:hover .front {
    transform: rotateY(180deg);
  }
  .card:hover .back {
    transform: rotateY(0deg);
  }
</style>
