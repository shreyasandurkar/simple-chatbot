const resources = [
  {
    name: "Start Here",
    category: "Getting started",
    description: "Choose a path for exploring an idea, growing a venture, joining a team, or figuring out your next step.",
    url: "https://www.bu.edu/innovate/start-here/",
    keywords: ["start", "starting", "where to begin", "where do i start", "new", "beginner", "idea", "not sure", "don't know", "do not know"]
  },
  {
    name: "Programs & Competitions",
    category: "Programs & applications",
    description: "Browse Innovate@BU programs, competitions, application details, and ways to get involved.",
    url: "https://www.bu.edu/innovate/programs-competitions/",
    keywords: ["program", "programs", "apply", "application", "applications", "competition", "accelerator", "fellowship", "incubator"]
  },
  {
    name: "Innovation Pathway",
    category: "Programs & mentorship",
    description: "A guided path to grow a venture with mentorship, funding, and resources. Rolling applications are available.",
    url: "https://www.bu.edu/innovate/programs-competitions/innovation-pathway/",
    keywords: ["idea", "startup", "venture", "business", "funding", "mentor", "mentorship", "coach", "coaching", "pathway", "launch", "grow"]
  },
  {
    name: "Enlight Fellowship",
    category: "Social impact programs",
    description: "A summer program pairing a Boston nonprofit internship with development of your own social venture.",
    url: "https://www.bu.edu/innovate/programs-competitions/enlight-fellowship/",
    keywords: ["social impact", "social venture", "social entrepreneurship", "nonprofit", "community", "fellowship", "enlight", "summer"]
  },
  {
    name: "Funding & Seed Grants",
    category: "Funding",
    description: "Explore current venture competitions, seed grants, and other funding opportunities and their application details.",
    url: "https://www.bu.edu/innovate/programs-competitions/",
    keywords: ["funding", "fund", "money", "grant", "grants", "seed grant", "seed grants", "prize", "cash", "competition", "sustainability", "wellbeing", "well-being", "financial"]
  },
  {
    name: "Events & Workshops",
    category: "Events & networking",
    description: "Find upcoming events, workshops, info sessions, and opportunities to meet the Innovate@BU community.",
    url: "https://www.bu.edu/innovate/events/",
    keywords: ["event", "events", "workshop", "workshops", "network", "networking", "meet people", "social impact friday", "fridays", "pitch", "pizza", "info session"]
  },
  {
    name: "Join a Student Team",
    category: "Student projects & community",
    description: "Connect with like-minded peers and explore student ventures and teams looking for collaborators.",
    url: "https://www.bu.edu/innovate/start-here/i-want-to-join-a-team/",
    keywords: ["join", "team", "startup", "existing startup", "cofounder", "co-founder", "collaborate", "project", "projects", "discussion", "discussion group", "discussion groups", "groups", "peers", "people", "community", "ai", "artificial intelligence", "technology"]
  },
  {
    name: "Explore Student Teams",
    category: "Student projects",
    description: "Search current and alumni student teams and explore the ventures they are building.",
    url: "https://www.bu.edu/innovate/start-here/teams/",
    keywords: ["student team", "student teams", "team directory", "venture directory", "student project", "projects", "profiles", "founders"]
  },
  {
    name: "Staff Office Hours",
    category: "Mentorship & office hours",
    description: "Book one-on-one support with Innovate@BU staff for venture development, fundraising, marketing, and more.",
    url: "https://www.bu.edu/innovate/about/office-hours/",
    keywords: ["mentor", "mentorship", "office hour", "office hours", "book", "appointment", "advice", "staff", "fundraising", "help"]
  },
  {
    name: "Experts-in-Residence",
    category: "Mentorship & experts",
    description: "Meet working founders who offer one-on-one coaching and expert guidance to BU students and recent alumni.",
    url: "https://www.bu.edu/innovate/programs-competitions/experts-in-residence/",
    keywords: ["expert", "experts", "expert in residence", "experts-in-residence", "faculty", "founder", "coach", "coaching", "mentor", "mentorship", "advice"]
  },
  {
    name: "BU & Greater Boston Resources",
    category: "Boston startup resources",
    description: "Explore campus organizations and partners across Greater Boston that support students, ventures, and startups.",
    url: "https://www.bu.edu/innovate/innovation-resources/",
    keywords: ["boston", "external", "resource", "resources", "incubator", "accelerator", "startup", "local", "greater boston", "organizations", "partners"]
  }
];

const stopWords = new Set([
  "a", "an", "and", "are", "can", "do", "for", "how", "i", "in", "is", "it",
  "me", "my", "of", "on", "the", "to", "what", "where", "with", "would",
  "find", "get", "help", "interested", "looking", "want"
]);

const form = document.querySelector("#chat-form");
const input = document.querySelector("#question");
const conversation = document.querySelector("#conversation");

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreResource(resource, query) {
  const normalizedQuery = normalize(query);
  const searchableText = normalize([
    resource.name,
    resource.category,
    resource.description,
    ...resource.keywords
  ].join(" "));
  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const searchableTokens = new Set(searchableText.split(" "));
  const queryWords = [...new Set(queryTokens.filter(word => !stopWords.has(word)))];
  let score = 0;

  for (const keyword of resource.keywords) {
    const normalizedKeyword = normalize(keyword);
    const isPhrase = normalizedKeyword.includes(" ");
    const matched = isPhrase
      ? ` ${normalizedQuery} `.includes(` ${normalizedKeyword} `)
      : queryTokens.includes(normalizedKeyword);
    if (normalizedKeyword && matched) {
      score += normalizedKeyword.includes(" ") ? 6 : 3;
    }
  }

  for (const word of queryWords) {
    if (searchableTokens.has(word)) {
      score += 1;
    }
  }

  if (normalize(resource.name) === normalizedQuery) {
    score += 2;
  }

  return score;
}

function searchResources(query) {
  return resources
    .map(resource => ({ resource, score: scoreResource(resource, query) }))
    .filter(result => result.score >= 2)
    .sort((left, right) => right.score - left.score)
    .slice(0, 4)
    .map(result => result.resource);
}

function addMessage(role, text) {
  const article = document.createElement("article");
  article.className = `message ${role === "user" ? "user-message" : "assistant-message"}`;

  if (role === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "i";
    article.append(avatar);
  }

  const body = document.createElement("div");
  body.className = "message-body";
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  if (text) {
    body.append(paragraph);
  }
  article.append(body);
  conversation.append(article);
  conversation.scrollTo({
    top: conversation.scrollHeight,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
  });
  return body;
}

function addResults(body, matches, query) {
  if (matches.length === 0) {
    const note = document.createElement("p");
    note.textContent = "Try another phrase, or browse the Innovate@BU starting point for a wider directory.";
    body.append(note);
    appendResourceList(body, [resources[0]]);
    return;
  }

  const intro = document.createElement("p");
  intro.className = "result-intro";
  intro.textContent = `Based on “${query}”, here are a few places to start:`;
  body.prepend(intro);
  appendResourceList(body, matches);
}

function appendResourceList(body, matches) {
  const list = document.createElement("ul");
  list.className = "result-list";

  for (const resource of matches) {
    const item = document.createElement("li");
    item.className = "result-card";

    const link = document.createElement("a");
    link.href = resource.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = resource.name;

    const category = document.createElement("span");
    category.className = "result-category";
    category.textContent = resource.category;

    const description = document.createElement("p");
    description.className = "result-description";
    description.textContent = resource.description;

    item.append(link, category, description);
    list.append(item);
  }

  body.append(list);
}

function submitQuestion(question) {
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion) {
    input.focus({ preventScroll: true });
    return;
  }

  addMessage("user", trimmedQuestion);
  const response = addMessage("assistant", "");
  addResults(response, searchResources(trimmedQuestion), trimmedQuestion);
  input.value = "";
  input.focus({ preventScroll: true });
}

form.addEventListener("submit", event => {
  event.preventDefault();
  submitQuestion(input.value);
});

document.querySelectorAll(".suggestion").forEach(button => {
  button.addEventListener("click", () => submitQuestion(button.textContent));
});
