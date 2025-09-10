function getEmailContent() {
  const selectors = ['.h7', '.a3s.ail', '.gmail_quote', '[role="presentation"]'];
  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) return content.innerText.trim();
  }
  return '';
}

function findToolBar() {
  const selectors = ['.btC', '.aDh', '[role="toolbar"]', '.gU.Up'];
  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) return toolbar;
  }
  return null;
}

function createAiBtn() {
  const button = document.createElement('div');
  button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';
  button.style.marginRight = '8px';
  button.innerHTML = 'AI reply';
  button.setAttribute('data-tooltip', 'Generate AI reply');
  return button;
}

function injectBtn() {
  const existingBtn = document.querySelector('.ai-reply-button');
  if (existingBtn) existingBtn.remove();

  const toolbar = findToolBar();
  if (!toolbar) {
    console.log("toolbar not found");
    return;
  }
  console.log("toolbar found");

  const button = createAiBtn();
  button.addEventListener('click', async () => {
    try {
      button.innerHTML = "Generating...";
      button.setAttribute("disabled", true);

      const emailContent = getEmailContent();

      const response = await fetch('http://localhost:8080/api/email/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailContent: emailContent,
          tone: "professional"
        })
      });

      if (!response.ok) throw new Error('API Request Failed');
      const data = await response.json();

      const generatedReply = data.response;
      const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
      if (composeBox) {
        composeBox.focus();
        document.execCommand('insertText', false, generatedReply);
      } else {
        console.error('compose box not found');
      }
    } catch (error) {
      alert(error);
      console.error('failed to generate reply', error);
    } finally {
      button.innerHTML = 'AI reply';
      button.removeAttribute("disabled");
    }
  });

  toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const addedNodes = Array.from(mutation.addedNodes);

    const hasComposeElements = addedNodes.some((node) => {
      if (node && typeof node.querySelector === "function") {
        return (
          (typeof node.matches === "function" &&
            node.matches('.aDh, .btC, [role="dialog"]')) ||
          node.querySelector('.aDh, .btC, [role="dialog"]')
        );
      }
      return false;
    });

    if (hasComposeElements) {
      console.log("detected");
      setTimeout(injectBtn, 500);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
