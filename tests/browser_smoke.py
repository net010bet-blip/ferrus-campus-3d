from pathlib import Path
from playwright.sync_api import sync_playwright
html=Path('/mnt/data/FERRO_JOGO_COMPLETO_OFFLINE.html').read_text()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1320,'height':800})
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html)
 page.wait_for_timeout(1300)
 assert page.locator('#loadScreen').is_hidden(), 'Loader ficou travado'
 assert page.evaluate('FERRO_RENDER_FRAMES')>=15,'Sem renderização'
 assert page.evaluate('FERRO_DEBUG.sim.metrics().live')>0,'Nenhuma máquina ativa'
 page.click('#btnMap'); assert page.locator('#modalTitle').inner_text()=='Mapa do complexo FERRO'
 page.locator('[data-action="goto"][data-id="hr"]').click()
 assert page.locator('#modal').is_hidden()
 assert page.evaluate('FERRO_DEBUG.player.z')>80,'Teletransporte para RH falhou'
 page.click('#btnInteract'); assert page.locator('#modalTitle').inner_text()=='Gestão de Pessoas'
 page.click('#btnClose');page.click('#btnTablet');assert 'Tablet industrial' in page.locator('#modalTitle').inner_text()
 page.click('#btnClose')
 before=page.evaluate('FERRO_DEBUG.player.x')
 page.keyboard.down('d');page.wait_for_timeout(350);page.keyboard.up('d');after=page.evaluate('FERRO_DEBUG.player.x');assert before!=after,'WASD não move'
 page.evaluate('FERRO_DEBUG.sim.advance(260)')
 assert page.evaluate('FERRO_DEBUG.sim.events.length')>0,'Faltou gerar eventos dinâmicos'
 page.click('#btnEvents');assert 'Não Conformidades' in page.locator('#modalTitle').inner_text()
 page.click('#btnClose')
 page.screenshot(path='/mnt/data/FERRO_ADMIN_BROWSER.png')
 print('DESKTOP PASS',{ 'frames':page.evaluate('FERRO_RENDER_FRAMES'), 'zones':page.evaluate('FERRO_DEBUG.world.tags.length'), 'events':page.evaluate('FERRO_DEBUG.sim.events.length'), 'movement_x':round(after-before,2), 'errors':errors})
 # Mobile iOS-like surface; emulation contexts use coarse pointers.
 mobile=b.new_context(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1')
 m=mobile.new_page();me=[];m.on('pageerror',lambda e:me.append(str(e)))
 m.set_content(html);m.wait_for_timeout(1800)
 assert m.locator('#loadScreen').is_hidden(),'Celular preso no loading'
 assert m.locator('#pad').is_visible(),'Sem joystick no celular'
 m.click('#btnMap');assert m.locator('#modal').is_visible()
 m.locator('[data-action="goto"][data-id="cnc1"]').click();assert m.locator('#modal').is_hidden()
 m.screenshot(path='/mnt/data/FERRO_CELULAR_BROWSER.png')
 print('MOBILE PASS',{'frames':m.evaluate('FERRO_RENDER_FRAMES'),'joystick':m.locator('#pad').is_visible(),'errors':me})
 b.close()
