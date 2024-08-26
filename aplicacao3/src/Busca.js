import React, { useContext, useState, useEffect, useRef } from 'react';
import ContadorResultadosEncontrados from './ContadorResultadosEncontrados';
import styled from 'styled-components';
import { DataContext } from './DataContext';
import { useNavigate } from 'react-router-dom';
import ErroComponent from './ErroComponent';
import moonImage from './bluemoon.png';
import useInput from './useInput';



function App() {
  const { fakeData, setFakeData, contadorRetorno, setContadorRetorno } = useContext(DataContext);

  const [quantidade, setQuantidade] = useState(1);
  const [gender, setGender] = useState('');
  const [birthdayStart, setBirthdayStart] = useState('');
  const [birthdayEnd, setBirthdayEnd] = useState('');
  const [buscarSubstring, setSearchSubstring] = useState('');
  const [sucesso, setSucesso] = useState(null);
  const [paginalAtual, setCurrentPage] = useState(1);
  const [itensNaPagina] = useState(10);
  const resultadosRef = useRef(null);
  const [erroRequisicao, setErroRequisicao] = useState(null);
  const [erroBusca, setErroBusca] = useState(null);
  const [selecionados, setSelecionados] = useState([]);
  const [mostrarExcluir, setMostrarExcluir] = useState(false);

  const navigate = useNavigate();

  const handleSelecionar = (dados) => {
    setSelecionados((prevSelecionados) => {
      if (prevSelecionados.includes(dados)) {
        return prevSelecionados.filter((item) => item !== dados);
      } else {
        return [...prevSelecionados, dados];
      }
    });
  };


  const handleSalvarSelecionados = async () => {
    const token = localStorage.getItem('token');
    limparMensagens();

    const dadosSelecionados = selecionados.map(dado => {
      const { botao, ...resto } = dado;

      return resto;
    });

    console.log('Dados Selecionados:', dadosSelecionados);
    console.log('Número de Dados Selecionados:', dadosSelecionados.length);

    if (selecionados.length === 0) {
      setErroRequisicao('Nenhum dado selecionado');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/logged/salvarDados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dadosSelecionados),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar os dados');
      }
      setSucesso(`Sucesso! Salvo ${dadosSelecionados.length} Dados Cadastrais`);
      setErroRequisicao('');
    } catch (error) {
      setErroRequisicao('Falha aos salvar Dados!')
    }
  };


  const handleExcluirSelecionados = async () => {
    const token = localStorage.getItem('token');
    const idsParaExcluir = selecionados.map(item => item._id);
    limparMensagens();

    if (idsParaExcluir.length === 0) {
      setErroRequisicao('Nenhum dado selecionado');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/logged/excluirDadosSalvos', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: idsParaExcluir }),
      });
      if (response.status === 403) {
        handle403Error(setErroRequisicao, navigate);
      }
      if (!response.ok) throw new Error('Falha ao excluir os dados');

      setFakeData(prevData => prevData.filter(item => !idsParaExcluir.includes(item._id)));
      setSelecionados([]);
      setSucesso('Dados excluídos com sucesso!');
    } catch (error) {
      setErroRequisicao('Falha ao excluir os dados. Por favor, tente novamente mais tarde.');
      setSucesso(null);
    }
  };


  const handleConsultarDadosSalvos = async () => {
    const token = localStorage.getItem('token');
    limparMensagens();
    try {
      const response = await fetch('http://localhost:3001/logged/buscarDadosSalvos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },

      }
      );

      if (response.status === 403) {
        handle403Error(setErroRequisicao, navigate);
      }
      if (!response.ok) throw new Error('Falha ao consultar dados');

      const data = await response.json();
      if (!Array.isArray(data)) {
        setErroRequisicao('Dados inválidos retornados pela API.');
        return;
      }

      setFakeData(data);
      setSucesso(`Dados recuperados com sucesso! Temos ${data.length} dados Recuperados`);
      setCurrentPage(1);
      setMostrarExcluir(true);

    } catch (error) {
      console.error('Erro ao consultar os dados:', error);
      setErroRequisicao('Falha ao consultar os dados. Por favor, tente novamente mais tarde.');
      setSucesso(null);
      setErroBusca(null);
      setMostrarExcluir(false);
    }
  };




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let valorValidado = value;

    if ((name === 'quantidade' && (isNaN(value) || parseInt(value) < 0))) {
      valorValidado = 0;
    }
    switch (name) {
      case 'quantidade':
        setQuantidade(valorValidado);
        break;
      case 'gender':
        setGender(value);
        break;
      case 'birthdayStart':
        setBirthdayStart(value);
        break;
      case 'birthdayEnd':
        setBirthdayEnd(value);
        break;
      case 'searchSubstring':
        setSearchSubstring(value.toLowerCase());
        break;
      default:
        break;
    }
    limparMensagens();
  };

  const limparMensagens = () => {
    setErroBusca(null);
    setErroRequisicao(null);
    setSucesso(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    limparMensagens();
    setFakeData([]);
    setMostrarExcluir(false);

    const quantidadeGerada = quantidadeInput.value;

    if (quantidadeGerada <= 0) {
      setErroRequisicao('Por favor, insira uma quantidade válida a ser gerado.');
      return;
    }
    const apiUrl = `https://fakerapi.it/api/v1/persons?_quantity=${quantidadeGerada}&_gender=${gender}&_birthday_start=${birthdayStart}&_birthday_end=${birthdayEnd}`;
    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!data || !data.data) {
        setErroRequisicao('Dados inválidos retornados pela API.');
        return;
      }

      for (const pessoa of data.data) {
        let imageUrl = '';
        if (pessoa.gender === 'male') {
          const responseDog = await fetch('https://dog.ceo/api/breeds/image/random');
          const responseDataDog = await responseDog.json();
          imageUrl = responseDataDog.message;
        } else {
          const responseCat = await fetch('https://api.thecatapi.com/v1/images/search?limit=1');
          const responseDataCat = await responseCat.json();
          imageUrl = responseDataCat[0].url;
        }
        if (!pessoa.Foto) {
          pessoa.Foto = imageUrl;
        }
        delete pessoa.image;
      }

      localStorage.setItem('fakeData', JSON.stringify(data.data));
      setSucesso(`Sucesso! Gerado ${data.data.length} Dados Cadastrais`);
      setFakeData(data.data);
      setCurrentPage(1);
      setMostrarExcluir(false);
    } catch (error) {
      console.error(error.message);
      setErroRequisicao('Falha ao executar requisição. Por favor, tente novamente mais tarde.');
      setSucesso(null);
      setErroBusca(null);
      setMostrarExcluir(false);
    }
  };

  function handle403Error(setError, navigate) {

    setError("Necessário realizar Login! Redirecionando...");
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  }



  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (buscarSubstring.trim() === '') {
        setErroBusca('Campo de busca vazio. Por favor, insira uma substring.');
      } else {
        setErroBusca(null);
      }
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    limparMensagens();
  };


  useEffect(() => {
    const dadosFiltrados = exibirDados(fakeData, buscarSubstring);
    const contador = dadosFiltrados.length;
    setContadorRetorno(contador);
    setCurrentPage(1);

  }, [fakeData, buscarSubstring, setContadorRetorno]);

  useEffect(() => {
    limparMensagens();
  }, [quantidade, gender, birthdayStart, birthdayEnd, buscarSubstring]);

  const exibirDados = (arrayDados, substring) => {
    return substring
      ? arrayDados.filter((dados) =>
        Object.values(dados).some(
          (valor) =>
            typeof valor === 'string' && valor.toLowerCase().includes(substring)
        )
      )
      : arrayDados;
  };

  const indexOfLastItem = paginalAtual * itensNaPagina;
  const indexOfFirstItem = indexOfLastItem - itensNaPagina + 1;
  const itemAtual = exibirDados(fakeData, buscarSubstring).slice(
    indexOfFirstItem - 1,
    indexOfLastItem
  );
  const quantidadeInput = useInput(1);
  return (

    <Tudo className='aplicacao'>

      <Titulo>
        <h2>Gerador de Dados Pessoais Falsos</h2>
        <MoonImage src={moonImage} alt="Blue Moon" />
        <h2>BlueMoon 1.0</h2>
      </Titulo>
      <Infos>
        <Inputs className='inputs'>
          <Form onSubmit={handleSubmit}>
            <div className='input-group'>
              <label htmlFor='quantidade'>Quantidade de registros a ser gerado:</label>
              <input
                type='number'
                id='quantidade'
                name='quantidade'
                value={quantidadeInput.value}
                onChange={quantidadeInput.onChange}
              />
            </div>
            <div className='input-group'>
              <label htmlFor='gender'>Gênero:</label>
              <select id='gender' name='gender' value={gender} onChange={handleInputChange}>
                <option value=''>Qualquer</option>
                <option value='male'>Masculino</option>
                <option value='female'>Feminino</option>
              </select>
            </div>
            <Botao type='submit'>Obter Dados Falsos Personalizados</Botao>

          </Form>


          {erroRequisicao && <ErroComponent erro={erroRequisicao} />}
          {sucesso && <SuccessMessage>{sucesso}</SuccessMessage>}
        </Inputs>



        <BuscaSubstring>
          <div className='input-group'>
            <label htmlFor='searchSubstring'>Buscar por Substring:</label>
            <input
              type='text'
              id='searchSubstring'
              name='searchSubstring'
              value={buscarSubstring}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder='Substring'
            />
          </div>

          {erroBusca && <ErroComponent erro={erroBusca} />}

          {buscarSubstring && contadorRetorno >= 0 && (
            <ContadorResultadosEncontrados quantidadeResultados={contadorRetorno} />
          )}
        </BuscaSubstring>

      </Infos>
      <BlocoExterno>

        <BlocoInterno>
          <Resultados ref={resultadosRef}>
            {itemAtual.map((dados, index) => (
              <ConjuntoDados key={index} className='conjuntoDados'>
                <hr />
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="checkbox"
                          onChange={() => handleSelecionar(dados)}
                          checked={selecionados.includes(dados)}
                        />
                      </td>
                      <td>
                        <table>
                          <tbody>
                            {Object.entries(dados).map(([chave, valor]) => (
                              <tr key={chave}>
                                <td>
                                  {chave === 'address' ? 'Endereço' :
                                    chave === 'id' ? 'Id' :
                                      chave === 'firstname' ? 'Nome' :
                                        chave === 'lastname' ? 'Sobrenome' :
                                          chave === 'email' ? 'Email' :
                                            chave === 'phone' ? 'Telefone' :
                                              chave === 'birthday' ? 'Data de Nascimento' :
                                                chave === 'gender' ? 'Gênero' :
                                                  chave.charAt(0).toUpperCase() + chave.slice(1)}
                                </td>
                                <td>
                                  {chave.trim() === 'Foto' ? (
                                    <img src={valor} alt={`Foto ${index}`} style={{ maxWidth: '100px' }} />
                                  ) : (
                                    chave === 'address' ?
                                      `Rua: ${valor.street} ${valor.streetName}, Cidade: ${valor.city}, País: ${valor.country}` :
                                      valor
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </ConjuntoDados>
            ))}
          </Resultados>





        </BlocoInterno>
        <Paginacao>
          <button onClick={() => handlePageChange(paginalAtual - 1)} disabled={paginalAtual === 1}>
            Anterior
          </button>
          <span>Página {paginalAtual}</span>
          <button
            onClick={() => handlePageChange(paginalAtual + 1)}
            disabled={itemAtual.length < itensNaPagina || paginalAtual * itensNaPagina >= contadorRetorno}
          >
            Próxima
          </button>
          <span>Total de Páginas: {Math.ceil(contadorRetorno / itensNaPagina)}</span>
        </Paginacao>
        <OpçoesAdm>
          <Botao onClick={handleConsultarDadosSalvos}>
            Consultar Dados Salvos
          </Botao>
          <Botao
            onClick={handleSalvarSelecionados}
            disabled={mostrarExcluir}
            style={{ display: mostrarExcluir ? 'none' : 'block' }}
          >
            Salvar Selecionados
          </Botao>
          <Botao
            onClick={handleExcluirSelecionados}
            disabled={!mostrarExcluir}
            style={{ display: mostrarExcluir ? 'block' : 'none' }}
          >
            Excluir Selecionados
          </Botao>
        </OpçoesAdm>
      </BlocoExterno>

      <Footer>
        <Assinatura>
          Mateus Moreira Fonseca © Projeto3 da Disciplina Full Stack-UTFPR
        </Assinatura>
      </Footer>
    </Tudo>
  );
}

const Infos = styled.div`
`;

const OpçoesAdm = styled.div`
  display: flex;
  justify-content: center;
  align-items: center; 
  margin-top: 20px; 
  gap: 1rem;
`;

const ConjuntoDados = styled.div`
  background-color: #001f3f; 
  margin: 0px;
  padding: 0; 
  `;

const Tudo = styled.div`
background-color: #001f3f; 
min-height: 98vh;
position: relative;
display: flex;
flex-direction: column;
word-break: break-word;
text-align: center;
align-content: start;
border-radius: 10px;
margin: 0px;
`;
const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #00BFF3;
  display: grid;
  justify-content: center;
  margin: 0px;
`;

const BlocoExterno = styled.div`
  background-color: #00BFF3;
  border: 2px solid #000;
  padding: 20px;
  width: 50%;
  height: auto;
  self-align:top;
  margin: auto;
  margin-top: 0rem;
  position: static;
  top: 50%; 
  left: 50%;
  align-content: start;
  margin-bottom: 2rem;
  
  
  `;

const Footer = styled.footer`
  background-color: #00BFF3;  
  width: 100%;
  height: 2.5rem;   
  position: absolute;
  bottom: 0;
`;

const BlocoInterno = styled.div`
  border: 2px solid #000; 
  border-top-left-radius: 10px; 
  border-bottom-left-radius: 10px;
  overflow: auto; 
  background-color: #00BFF3;  
  height: 50vh;
  margin-bottom: 1rem; 
  
`;

const Titulo = styled.div`
  background-color: #00BFF3;
  font-size: 15px;
  margin-top: 0px;
  align-items: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #001f3f ;
  
  
`;

const MoonImage = styled.img`
  width: 100px;
  height: auto;
  margin-bottom: 10px;
`;

const Resultados = styled.div`
  max-height: 600px;
  max-width: 400px;
  margin: 0 auto;
  background-color: #00BFF3;
  font-size: 16px;
  margin-top: 0px;
  margin-bottom: 15px;
  border-spacing: 0;
  
  
  tr:nth-child(even) {
    background-color: #f2f2f2; 
  }
  tr:nth-child(odd) {
    background-color: #ffffff; 
  }
  table {
    width: 100%;
  }
  td {
    width: 10%; 
    text-align: left; 
  }
  tr:hover {
    background-color: #ddd; 
`;


const Assinatura = styled.footer`
  background-color: #101e36;
  color: #fff;
  padding: 10px;
  font-size: 12px;
  text-align: center;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px; 
`;

const BuscaSubstring = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 22px;
  margin-bottom: 15px;
  color:white;
`;



const Form = styled.form`
  display: flex;
  flex-direction: column;
  font-size: 20px;
  border-radius: 10px;
`;

const Botao = styled.button`
  background-color: blue;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: darkblue;
  }
  margin-top: 5px;
  margin-bottom: 5px;
`;

const SuccessMessage = styled.div`
  color: green;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
`;

const Paginacao = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    margin: 0 5px;
    cursor: pointer;
  }
  button:disabled {
    cursor: not-allowed;
  }
  margin-bottom: 10px;
`;

export default App;
