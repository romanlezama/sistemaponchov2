# -*- coding: utf-8 -*-
import sys, pyexcel, re,json
# Leer el documento de excel
def read_excel_sheets(sheet_name=None, file_url=None, all_sheets=False):
    #if True:
    try:
        book_dict = pyexcel.get_book_dict(file_name=file_url)
        if all_sheets:
            dict_all_sheets = {}
            for name_sheet in book_dict:
                records = book_dict[name_sheet]
                if records:
                    header = records.pop(0)
                else:
                    header = []
                try:
                    header = [str(col).lower().replace(u'\xa0',u' ').strip().replace(' ', '_') for col in header]
                except UnicodeEncodeError:
                    header = [col.lower().replace(u'\xa0',u' ').strip().replace(' ', '_') for col in header]
                dict_all_sheets[ name_sheet.lower().replace(' ', '_') ] = {
                    'header': header,
                    'records': records
                }
            return dict_all_sheets
        if book_dict.get(sheet_name):
            records = book_dict[sheet_name]
            header = records.pop(0)
            try:
                header = [str(col).lower().replace(u'\xa0',u' ').strip().replace(' ', '_') for col in header]
            except UnicodeEncodeError:
                header = [col.lower().replace(u'\xa0',u' ').strip().replace(' ', '_') for col in header]
            return header, records
    except Exception as e:
        print( json.dumps({'error': 'Ocurrio un error al leer el documento Excel', 'msg': str(e)}) )

def get_month_number( m ):
    dict_months = {
        "ene": "01",
        "feb": "02",
        "marz": "03",
        "abr": "04",
        "may": "05",
        "jun": "06",
        "jul": "07",
        "ago": "08",
        "sep": "09",
        "oct": "10",
        "nov": "11",
        "dic": "12"
    }
    return dict_months.get( m, '0' )

def get_full_date( text_with_date ):
    try:
        text_fecha = text_with_date.split(')')[1]
        text_fecha = text_fecha.lower()

        # 'text_fecha=',text_fecha
        
        day = re.search(r"[0-9]{1,2}", text_fecha, re.IGNORECASE).group()
        int_day = int(day)
        day = "0"+str(int_day) if int_day < 10 else day
        # 'day=',day
        
        month = re.search(r"ene|feb|marz|abr|may|jun|jul|ago|sep|oct|nov|dic", text_fecha, re.IGNORECASE).group()
        # 'month=',month
        n_month = get_month_number(month)
        
        year = re.search(r"202[0-9]", text_fecha, re.IGNORECASE).group()
        # 'year=',year
        full_date = year + '-' + n_month + '-' + day
        # 'full_date=',full_date
        return full_date
    except Exception as e:
        return {'error': 'No se pudo encontrar la fecha en la hoja diesel', 'msg': 'text_with_date= {} error= {}'.format(text_with_date, e)}

"""
# Procesa la pagina de Diesel para obtener los totales de las ventas y la fecha de la venta
"""
def process_diesel_sheet( content_sheet ):
    # Obtengo el texto donde está la fecha de corte
    # '====== Buscando la fecha ======'
    text_with_date = ''
    for r in content_sheet:
        for c in r:
            #if re.match(r"(TEOTI|teoti|Teoti).*(\s+)?\((\s+)?(\d+)(\s+)?\)", str(c)):
            if re.match(r"(TEOTI|teoti|Teoti).*(\s+)?\((\s+)?(\d+(-\d+)?)(\s+)?\)", str(c)):
                text_with_date = c
                break
        if text_with_date:
            break
    # 'text_with_date=',text_with_date
    
    # Proceso el texto encontrado para formatear la fecha
    full_date = ''
    if text_with_date:
        full_date = get_full_date( text_with_date )

    # Recorro de nuevo la información de la hoja para buscar los totales
    # '====== Buscando los totales ======'
    pos_row = None
    pos_col = None
    for cont_r, r in enumerate(content_sheet):
        for cont_c, c in enumerate(r):
            if str(c).lower().strip() == "r1":
                pos_row = cont_r
                pos_col = cont_c
                break
        if pos_row and pos_col:
            break
    # 'pos_row=',pos_row
    # 'pos_col=',pos_col
    if not pos_row or not pos_col:
        dict_totales = {'error': 'No se encontraron las posiciones para obtener los totales', 'msg': 'pos_row= {} pos_col= {}'.format(pos_row, pos_col)}
    else:
        dict_totales = {}
        for r in content_sheet[pos_row:]:
            tipo_bomba = r[ pos_col ]
            if not tipo_bomba:
                break
            dict_totales.update({
                tipo_bomba: round(r[ pos_col + 1 ], 2)
            })
    # 'dict_totales=',dict_totales
    return dict_totales, full_date

"""
# Procesa la pagina de Notas para obtener las compras de los Clientes
"""
def get_client_name( full_name ):
    listEval = ['vales', 'notas', 'vale', 'nota']
    for strEval in listEval:
        lName = full_name.split( strEval )
        if len(lName) > 1:
            return lName[1].strip()
    return ''

def process_notas_sheet( content_sheet ):
    # '====== Buscando las ventas a los clientes ======'
    dict_ventas_clientes = {}
    for r in content_sheet:
        for cont_c, c in enumerate(r):
            try:
                if re.match(r"^[0-9]{1,3}\s+?(vale|nota)", c.lower().strip()):
                    monto_vendido = 0
                    for cc in r[ cont_c + 1: ]:
                        try:
                            monto_vendido = round( float( cc ), 2 )
                            break
                        except:
                            continue
                    nameClient = get_client_name( c.lower() )
                    dict_ventas_clientes.update({
                        nameClient.lower().replace('.', ''): monto_vendido
                    })
            except:
                continue
    # 'dict_ventas_clientes=',dict_ventas_clientes
    return dict_ventas_clientes

if __name__ == "__main__":
    # Dictionary ={1:'Welcome', 2:'to',3:'Geeks', 4:'for',5:'Geeks'}
    # print(json.dumps(Dictionary))

    name_file = sys.argv[1]
    
    # Dirección donde está guardado el Excel
    # Windows
    file_url = 'C:/xampp/htdocs/sistemaponchov2/excel_files/{}.xlsx'.format(name_file)
    # Ubuntu
    #file_url = '/var/www/html/sistemaponchov2/excel_files/{}.xlsx'.format(name_file)
    
    # Obtengo un diccionario con las páginas y el contenido de cada una
    dict_all_sheets_excel = read_excel_sheets(file_url=file_url, all_sheets=True)
    dict_totales_found, full_date = process_diesel_sheet( dict_all_sheets_excel.get('diesel', {}).get('records', []) )
    dict_ventas_clientes = process_notas_sheet( dict_all_sheets_excel.get('notas', {}).get('records', []) )
    print( json.dumps( {
        'full_date': full_date,
        'totales': dict_totales_found,
        'clientes': dict_ventas_clientes
        } ) )