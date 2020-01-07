import React from 'react'
import { withRouter } from 'react-router-dom'
import LancamentoService from '../../app/service/lancamentoService'
import LocalStorageService from '../../app/service/localstorageService'

import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import * as messages from '../../components/toastr'


class CadastroLancamentos extends React.Component {
   state = {
      id: null,
      descricao: '',
      ano: '',
      mes: '',
      valor: '',
      tipo: '',
      status: '',
      usuario: null,
      atualizando: false
   }

   constructor() {
      super();
      this.service = new LancamentoService();
   }
   
   componentDidMount(){
      const params = this.props.match.params
      if(params.id){
         this.service.obterPorId(params.id)
            .then(response => {
               this.setState({...response.data})
            })
            .catch(erros => {
               messages.mensagemErro(erros.response.data)
            })
      }
   }

   submit= () => {
      const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')
      const { descricao, valor, mes, ano, tipo  } = this.state;
      const lancamento = { descricao, valor, mes, ano, tipo, usuario: usuarioLogado.id }
     

      this.service
         .salvar(lancamento)
         .then( response => {
            this.props.history.push('/consulta-lancamentos')
            messages.mensagemSucesso('Lançamento cadastrado com sucesso!')
         }).catch(error => {
            messages.mensagemErro(error.response.data)
         })
   }

   atualizar = () => {      
      const { descricao, valor, mes, ano, tipo, id, usuario, status } = this.state;
      const lancamento = { descricao, valor, mes, ano, tipo, id, usuario, status }
     

      this.service
         .atualizar(lancamento)
         .then( response => {
            this.props.history.push('/consulta-lancamentos')
            messages.mensagemSucesso('Lançamento cadastrado com sucesso!')
         }).catch(error => {
            messages.mensagemErro(error.response.data)
         })
   }
   
   handleChange = (event) => {
      const value = event.target.value;
      const name = event.target.name;

      this.setState({ [name] : value })
   }

   render() {

      const meses = this.service.obterListaMeses();
      const tipos = this.service.obterListaTipos();

      return(
         <Card title="Cadastro de Lançamentos">
            <div className="row">
               <div className="col-md-12">
                  <FormGroup id="inputDescricao" label="Descrição: *">
                     <input id="inputDescricao" type="text" 
                           className="form-control"
                           name="descricao"
                           value={this.state.descricao}
                           onChange={this.handleChange} />
                  </FormGroup>
               </div>
            </div>
            <div className="row">
               <div className="col-md-6">
                  <FormGroup id="inputAno" label="Ano: *" >
                     <input id="inputAno" type="text" 
                           className="form-control"
                           name="ano"
                           value={this.state.ano}
                           onChange={this.handleChange}/>
                  </FormGroup>
               </div>
               <div className="col-md-6">
                  <FormGroup id="inputMes" label="Mes: *" >
                     <SelectMenu id='imputMes'
                                 name="mes"
                                 value={this.state.mes}
                                 onChange={this.handleChange}
                                 className="form-control" 
                                 lista={meses} />
                  </FormGroup>
               </div>
            </div>
            <div className="row">
               <div className="col-md-4">
                  <FormGroup id="inputValor" label="Valor: *" >
                     <input id="inputValor" type="text" 
                              className="form-control"
                              name="valor"
                              value={this.state.valor}
                              onChange={this.handleChange}/>
                  </FormGroup>
               </div>
               <div className="col-md-4">
                  <FormGroup id="inputTipo" label="Tipo: *" >
                     <SelectMenu id="inputTpo"
                                 name="tipo"
                                 value={this.state.tipo}
                                 onChange={this.handleChange}
                                 className="form-control" 
                                 lista={tipos}
                     />
                  </FormGroup>
               </div>
               <div className="col-md-4">
                  <FormGroup id="inputStatus" label="Status: " >
                     <input id="inputStatus" 
                           name="status"
                           value={this.state.status}
                           onChange={this.handleChange}
                           type="text" 
                           className="form-control" disabled/>
                  </FormGroup>
               </div>
               
            </div>
            <div className="row">
               <div className="col-md-6">
                  <button onClick={this.submit} className="btn btn-success">Salvar</button>
                  <button onClick={this.atualizar} className="btn btn-success">Atualizar</button>
                  <button onClick={e => this.props.history.push('/consulta-lancamentos')} className="btn btn-danger">Cancelar</button>
               </div>
            </div>
         </Card>
      )
   }
}

export default withRouter(CadastroLancamentos);