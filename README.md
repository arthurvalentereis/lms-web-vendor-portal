# Portal Comercial Letmesee (`lms-web-vendor-portal`)

Frontend do portal comercial para vendedores. Consome branding e configurações por domínio via API Letmesee (`/api/vendor-portal/branding`).

## Desenvolvimento

```bash
npm install
npm run dev
```

Porta padrão: `44442`. API proxy/config: variável `VITE_APP_API`.

## Branding white-label

O portal aplica automaticamente **nome**, **cor primária**, **logo**, **favicon** e **manifest PWA** com base no host de acesso.

### Configuração (admin Letmesee)

1. Abra **Perfil da empresa** → accordion **Portal do Vendedor**
2. Salve identidade visual: nome exibido, cor, logo e favicon
3. Registre o **domínio customizado** (ex.: `comercial.suaempresa.com.br`)
4. Configure DNS conforme instruções e clique em **Verificar**

Endpoints admin: `GET/PUT /UserCompany/{id}/vendor-portal-settings` (+ rotas de domínio).

### Comportamento em runtime

- Ao carregar, `VendorBrandingProvider` chama `GET /vendor-portal/branding?host={window.location.host}`
- Se o host corresponder a um `CustomDomain` ativo → `isCustom: true` e aplica aparência da empresa
- Caso contrário → branding Letmesee padrão (`#835afd`)

**Importante:** em `localhost:44442` o branding custom **não** aparece, a menos que esse host esteja registrado como domínio. Para testar localmente, aponte o domínio no arquivo `hosts` ou use o domínio publicado na Vercel.

### Checklist de verificação manual

1. **Admin:** salvar nome, cor, logo e favicon no Portal do Vendedor
2. **Domínio:** registrar e verificar DNS até status Verified
3. **Acesso:** abrir o portal pelo domínio customizado
4. **Network:** confirmar `GET /api/vendor-portal/branding?host=...` com `isCustom: true`
5. **DOM:** variáveis `--letmesee-purple-*` alteradas; `link[rel=icon]` e `link[rel=apple-touch-icon]` com URL custom
6. **UI:** logo e nome custom no login, sidebar e título das páginas (`usePortalPageMeta`)
7. **PWA:** manifest em runtime reflete nome/cor/ícone da marca (instalação mobile)

### Arquivos relevantes

| Arquivo | Função |
|---------|--------|
| `src/contexts/VendorBrandingContext.tsx` | Fetch e aplica branding no boot |
| `src/lib/portalBranding.ts` | CSS vars, favicon, apple-touch-icon, manifest PWA dinâmico |
| `src/hooks/usePortalPageMeta.ts` | SEO (`siteName`, título das páginas) |
| `src/components/VendorBrandLogo.tsx` | Logo custom / iniciais / Letmesee |
