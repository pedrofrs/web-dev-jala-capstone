Role: Senior UX/UI Designer & Full-Stack Architect.
Project: UniLibrary – A high-end University Library Management System.
Design Language: "Academic-Tech" (The functional elegance of Nubank/Fintech applied to institutional education). Clean, airy, high-contrast, and authoritative.

1. Visual Identity & Brand System Upgrade

Aesthetic: Transition from "Casual Reader" to "Institutional Tool." Use a 12-column grid with generous whitespace (32px+).

Palette: * Primary: #EB354E (Soft Red) – For high-priority actions and institutional branding.

Secondary: #1E293B (Deep Slate) – For navigation and typography to ensure accessibility.

Background: #F8FAFC (Canvas) and #FFFFFF (Cards).

Typography: Use Inter or Poppins. H1s should be bold and professional. Use monospaced fonts (like JetBrains Mono) for shelf codes and ISBNs to give a "systematic" feel.

Components: 12px-16px corner radiuses. Elevation 1 shadows (0px 4px 12px rgba(0,0,0,0.05)).

2. Screen Architecture & "University-First" Features

SCREEN 1: Academic Discovery (Catalog)

Search Engine: Beyond titles, add filters for ISBN, DOI, and Department (e.g., Engineering, Law, Arts).

Book Cards: Must include the Shelf Location (Call Number) like "823.914 R784."

Availability: Distinguish between "Physical Copy" and "Digital Access (PDF/E-book)."

Course Reserves: A special section for "Required Reading" filtered by Professor or Subject Code (e.g., CS101).

SCREEN 2: Technical Book Intelligence (Details)

Institutional Metadata: Show Publisher, Edition, Year, and Number of Pages clearly.

Citation Tool: A "Copy Citation" button that generates the reference in APA, MLA, or ABNT formats.

Physical Map: A small UI element or button indicating which floor/wing the book is located in.

Academic Impact: If available, show a "Referenced in X Theses" badge.

SCREEN 3: Student Academic Hub (My Library)

Identity: Show the Student's Name and University ID Number.

Financials: A "Fines & Dues" widget using the Nubank-style card (Clear balance, "Pay Now" button if there are late returns).

Renewal Logic: Only show "Renew" if the book isn't reserved by another student.

Reservation Queue: A list of books the student is currently waiting for.

SCREEN 4: Global Institutional Navigation

Sidebar: Icons for "Explore", "My Loans", "Study Room Booking", and "Research Databases".

Status Bar: Highlighting "System Status" or "Library Hours."

3. Functional Refinements

States: Design a professional "Empty State" that suggests searching for digital alternatives.

Interactions: Micro-interactions for the "Borrow" flow that feel secure and confirmed.

Tone of Voice: Professional, helpful, and direct. Use "Return Date" instead of "Due Date" to be more user-friendly but keep it formal.

Sugestões de melhorias para o sistema
Para que o sistema pareça mais robusto e "universitário", aqui estão 4 melhorias práticas que você pode implementar no código:

Localização Física (Shelf ID): No catálogo e nos detalhes, adicione onde o livro está (ex: Ala Norte - Estante 4 - Prateleira B). Isso é essencial em bibliotecas reais.

Gerador de Citação: Adicione um botão "Citar este livro" que abre um modal com a referência pronta em ABNT/APA. Isso ganha o coração de qualquer estudante.

Integração com Disciplinas: No Catalog.tsx, adicione um filtro de "Reserva de Disciplina". O aluno seleciona "Cálculo I" e o sistema filtra apenas os livros indicados pelo professor daquela matéria.

Gestão de Multas: No BorrowedBooks.tsx, se um livro estiver "Atrasado", calcule automaticamente uma multa fictícia (ex: R$ 2,00 por dia). Isso aproxima o visual do de um aplicativo financeiro (como o Nubank) e traz a seriedade do ambiente acadêmico.