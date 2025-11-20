import requests, time
BASE='http://127.0.0.1:8001/api'
print('Create honeyfile...')
resp = requests.post(f'{BASE}/honeyfiles/create', json={'file_name': f'test_honey_{int(time.time())}.docx','file_type':'docx','template_type':'passwords','seed_locations':['C:/temp']})
print('status', resp.status_code)
print(resp.json())
print('\nList honeyfiles:')
resp = requests.get(f'{BASE}/honeyfiles/list')
print(resp.status_code, len(resp.json()))

print('\nCreate file share...')
resp = requests.post(f'{BASE}/file-shares/create', json={'share_name':'TestShare','share_path':'\\\\server\\share','description':'Test','is_sensitive':True,'shared_with_users':['user1'],'shared_with_groups':['group1']})
print('status', resp.status_code)
print(resp.json())
share_id = resp.json().get('id')
print('\nList file shares:')
resp = requests.get(f'{BASE}/file-shares/list')
print(resp.status_code, resp.json())

print('\nDelete file share...')
resp = requests.delete(f'{BASE}/file-shares/{share_id}')
print(resp.status_code, resp.text)

print('\nFinal file shares:')
resp = requests.get(f'{BASE}/file-shares/list')
print(resp.status_code, resp.json())
