import { StatusBar } from 'expo-status-bar';
import { Button, FlatList, ScrollView, TextInput, StyleSheet, Text, View, Alert, TouchableHighlight, Modal, Pressable } from 'react-native';
import { useState } from 'react';

let productos = [
  { nombre: "Polaca", categoria: "Bebidas", precioCompra: '0.45', precioVenta: '0.54', id: '100' },
  { nombre: "Ricas", categoria: "Galleta", precioCompra: '0.55', precioVenta: '0.66', id: '101' },
  { nombre: "Ryskos", categoria: "Snack", precioCompra: '0.40', precioVenta: '0.48', id: '102' },
  { nombre: "Manzana", categoria: "Fruta", precioCompra: '0.20', precioVenta: '0.24', id: '103' },
  { nombre: "Agua cielo", categoria: "Bebidas", precioCompra: '0.45', precioVenta: '0.54', id: '104' },
  { nombre: "Atun", categoria: "Enlatados", precioCompra: '1.45', precioVenta: '1.74', id: '105' },

];
//esta variable nos sirve para validar si el cliente existe o se modifica
let esNuevo = true;
//esta valiable sirve para almacenar el indice del arreglo para la edicion
let indiceSeleccionado = -1 //se inicializa en -1 para evitar que obtenga indices existentes

export default function App() {

  const [txtCodigo, setTxtCodigo] = useState();
  const [txtNombre, setTxtNombre] = useState();
  const [txtCategoria, setTxtCategoria] = useState();
  const [txtPrecioCompra, setTxtPrecioCompra] = useState();
  const [txtPrecioVenta, setTxtPrecioVenta] = useState();
  const [txtnumElemntos, setTxtNumElemntos] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const onPressE = (indice, producto) => {
    setTxtCodigo(producto.id)
    setTxtNombre(producto.nombre)
    setTxtCategoria(producto.categoria)
    setTxtPrecioCompra(producto.precioCompra)
    setTxtPrecioVenta(producto.precioVenta)
    esNuevo = false
    indiceSeleccionado = indice
  }

  const onPressX = (indiceSeleccionado) => {
    productos.splice(indiceSeleccionado, 1)
    setTxtNumElemntos(productos.length)
    setModalVisible(!modalVisible)
  }


  let ItemProducto = ({ indice, producto }) => {
    return (
      <ScrollView>
        <View style={styles.caja}>
          <View style={styles.itemIndice}>
            <Text style={styles.txtTitulo}>
              {producto.id}
            </Text>
            {setTxtNumElemntos(productos.length)}
          </View>
          <View style={styles.itemDetalleProducto}>
            <View style={styles.itemDetalleNombreProduc}>
              <Text style={styles.txtNombre}>
                {producto.nombre}
              </Text>
              <Text style={styles.txtNombre}>
                {producto.categoria}
              </Text>
            </View>
            <Text style={styles.txtPrecio}>
              USD {producto.precioVenta}
            </Text>
          </View>
          <View style={styles.itemDetalleBotones}>

            <TouchableHighlight onPress={() => onPressE(indice, producto)}>
              <View style={styles.botonE}>
                <Text style={styles.txtBotonE}> E </Text>
              </View>
            </TouchableHighlight>

            <Modal
              animationType='slide'
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Opcion cerrada');
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.ceteredView}>
                <View style={styles.modalViewX}>
                  <View style ={styles.txtModal}>
                    <Text style={styles.txtNombre}> ¿Está seguro que quiere eliminar? </Text>
                  </View>
                  <View style={styles.botonesEliminar}>
                    <Pressable style={[styles.button, styles.buttonOpen]}
                      onPress={() => onPressX(indiceSeleccionado)}>
                      <Text style={styles.buttonText}> Si </Text>
                    </Pressable>
                    <Pressable style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text style={styles.buttonText}> No </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>

            <Button
              title=' X '
              color='crimson'
              onPress={() => {
                indiceSeleccionado = indice
                setModalVisible(true)
              }}

            />
          </View>
        </View>
      </ScrollView>)
  }

  let limpiar = () => {
    esNuevo = true;
    setTxtCategoria(null)
    setTxtCodigo(null)
    setTxtNombre(null)
    setTxtPrecioCompra(null)
    setTxtPrecioVenta(null)
  }

  let existeProducto = () => {
    for (let i = 0; i < productos.length; i++) {
      if (productos[i].id == txtCodigo) {
        return true;
      }
    }
    return false;
  }

  let calculoVenta = () => {
    let precioCompra = parseFloat(txtPrecioCompra);
    if (!isNaN(precioCompra)) {
      let precioVenta = (precioCompra * 0.20) + precioCompra;
      return precioVenta.toFixed(2);
    }
    return '';
  }


  let guardarProducto = () => {

    if (esNuevo) {
      if (existeProducto() == false) {
        if (txtNombre !== "" && txtCategoria !== "" && txtPrecioCompra !== "" && txtPrecioVenta !== "" && txtCodigo !== "") {
          let producto = { nombre: txtNombre, categoria: txtCategoria, precioCompra: txtPrecioCompra, precioVenta: calculoVenta(txtPrecioCompra), id: txtCodigo }
          productos.push(producto);
        } else {
          Alert.alert("INFO", "Por favor, llene todos lo campos de productos")
        }

      } else {
        Alert.alert("INFO", "Ya existe un producto con el código: " + txtCodigo)
      }
    } else {
      productos[indiceSeleccionado].nombre = txtNombre
      productos[indiceSeleccionado].categoria = txtCategoria
      productos[indiceSeleccionado].precioCompra = txtPrecioCompra
      productos[indiceSeleccionado].precioVenta = calculoVenta(txtPrecioCompra)
      productos[indiceSeleccionado].id = txtCodigo
    }

    limpiar();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.txtTitulo} >PRODUCTOS</Text>

      <View style={styles.containerCabeza}>
        <ScrollView>
          <TextInput style={styles.cajaTxt}
            value={txtCodigo}
            onChangeText={setTxtCodigo}
            placeholder='CÓDIGO'
            keyboardType='numeric'
            editable={esNuevo}
          />
          <TextInput style={styles.cajaTxt}
            value={txtNombre}
            onChangeText={setTxtNombre}
            placeholder='NOMBRE'
          />
          <TextInput style={styles.cajaTxt}
            value={txtCategoria}
            onChangeText={setTxtCategoria}
            placeholder='CATEGORIA'
          />
          <TextInput style={styles.cajaTxt}
            value={txtPrecioCompra}
            onChangeText={setTxtPrecioCompra}
            placeholder='PRECIO DE COMPRA'
            keyboardType='numeric'
          />

          <TextInput style={styles.cajaTxt}
            value={calculoVenta(txtPrecioCompra)}
            onChangeText={setTxtPrecioVenta}
            placeholder='PRECIO VENTA'
            keyboardType='numeric'
            editable={false}
          />

          <View style={styles.areaBotones}>
            <Button
              title='NUEVO'
              onPress={() => {
                limpiar();
              }}
            />
            <Button
              title='GUARDAR'
              onPress={() => {
                guardarProducto();
              }}
            />
            <Text style={styles.txtElementos}>
              Productos: {txtnumElemntos}
            </Text>
          </View>
        </ScrollView>
      </View>


      <View style={styles.containerCuerpo}>
        <FlatList
          data={productos}
          renderItem={({ index, item }) => {
            return <ItemProducto indice={index} producto={item} />
          }}
          keyExtractor={item => {
            return item.id;
          }}
        />
      </View>

      <View style={styles.containerPie} >
        <Text>
          Autor: Marlon Lalangui ©
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'pink',
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: 40
  },
  containerCabeza: {
    //backgroundColor: 'black',
    //alignItems: 'center',
    flex: 4,
    padding: 10,
  },
  containerCuerpo: {
    flex: 5,
    padding: 10,

  },
  containerPie: {
    flex: 0.5,
    alignItems: 'flex-end'
  },
  txtTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    //paddingLeft: 0
  },
  caja: {
    flexDirection: 'row',
    backgroundColor: 'paleturquoise',
    borderColor: 'green',
    borderWidth: 2,
    marginBottom: 15,
    borderRadius: 8,
    padding: 10
  },
  itemIndice: {
    flex: 2,
    justifyContent: 'center',
    alignContent: 'center',
    paddingLeft: 5
  },
  itemDetalleProducto: {
    flexDirection: 'row',
    paddingLeft: 5,
    flex: 9,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemDetalleNombreProduc: {
    flexDirection: 'column',

  },
  itemDetalleBotones: {
    flexDirection: 'row',
    //backgroundColor:'black',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  cajaTxt: {
    borderWidth: 2,
    backgroundColor: 'white',
    borderColor: 'gray',
    padding: 5,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 20,
  },
  txtNombre: {
    fontStyle: 'italic',
    fontSize: 25
  },
  txtElementos: {
    fontStyle: 'italic',
    fontSize: 18
  },
  txtPrecio: {
    fontWeight: 'bold',
    fontSize: 20
  },
  areaBotones: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  botonE: {
    backgroundColor: '#67B822',
    padding: 10,
  },

  txtBotonE: {
    fontSize: 12.7,
    fontWeight: 'bold',
    color: 'white'
  },

  ceteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalViewX: {
    margin: 25,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
  },
  botonesEliminar: {
    //backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    width: 100, // Ajusta el ancho según tus necesidades
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  buttonOpen: {
    backgroundColor: 'cadetblue',
  },
  buttonClose: {
    backgroundColor: 'crimson',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  },
 

});
