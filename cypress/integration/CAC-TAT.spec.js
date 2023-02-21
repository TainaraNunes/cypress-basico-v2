/// <reference types="Cypress" />

//const { fn } = require("cypress/types/jquery")
//const {delay} = require("cypress/types/bluebird")

describe('Central de Atendimento ao Cliente TAT', function() {

    //Visita a pagina antes de iniciar cada teste, para nao precisar visitar em cada teste;
    beforeEach(function() {        
        //Visita a pagina que esta na pasta src;
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        //Titulo deve ser igual a string;
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
    })

    
    it('preenche os campos obrigatórios e envia o formulário', function() {
        const longTest = 'Teste digitar texto longo, teste digitar texto longo, teste digitar texto longo, Teste digitar texto longo, teste digitar texto longo, teste digitar texto longo'
        
        //Campos recebem os textos;
        cy.get('#firstName').type('Tainara')
        cy.get('#lastName').type('Nunes')
        cy.get('#email').type('tainaranunes_dv@hotmail.com')
        cy.get('#open-text-area').type(longTest, {delay:10})

        //Clica no botao;
        //cy.get('button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()
        
        //Testa se a mensagem de sucesso foi apresentada;
        cy.get('.success').should('be.visible')
    })

    it('Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.get('#firstName').type('Tainara')
        cy.get('#lastName').type('Nunes')

        //Se o campo tiver com esse formato (invalido);
        cy.get('#email').type('tainaranunes_dv@hotmail,com')

        cy.get('#open-text-area').type('Teste')

        //Mensagem de erro esta visivel;
        //cy.get('.error').should('be.visible')
    })

    it('Campo telefone fica vazio quando informado valor não numérico', function() {
        //Nao permite digitar letras no campo que so aceita numeros, passando a deixar em branco quando digitado letras;
        cy.get('#phone')
          .type('abcdefgihj')
          .should('have.value','')
    })  

    it('Exibe mensagem de erro quando o telefone se torna obrigatorio mas não é informado', function() {
        cy.get('#firstName').type('Tainara')
        cy.get('#lastName').type('Nunes')
        cy.get('#email').type('tainaranunes_dv@hotmail.com')

        //Marca o checkbox do telefone mas nao informa o numero no campo do telefone;
        cy.get('#phone-checkbox').check()
      
        cy.get('#open-text-area').type('Teste')  

        //Clica em enviar;
        //cy.get('button[type="submit"]').click()
        cy.contains('button', 'Enviar').click()

        //Apresenta mensagem de erro;
        //cy.get('.error').should('be.visible')
    }) 

    it('Preenche e limpa os campos nome, sobrenome, email e telefone', function() {

        //Preenche o campo, valida o que foi informado, limpa e valida novamente se esta em branco;
        cy.get('#firstName')
          .type('Tainara')
          .should('have.value', 'Tainara')
          .clear()
          .should('have.value', '')

        cy.get('#lastName')
          .type('Nunes')
          .should('have.value', 'Nunes')
          .clear()
          .should('have.value', '')
  
        cy.get('#email')
          .type('tainaranunes_dv@hotmail.com')
          .should('have.value', 'tainaranunes_dv@hotmail.com')
          .clear()
          .should('have.value', '')

        cy.get('#phone')
          .type('999065346')
          .should('have.value', '999065346')
          .clear()
          .should('have.value', '')
        })     

    it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
        //Clica no botao de enviar sem preencher os campos;
        cy.contains('button', 'Enviar').click()
      
        //Apresenta mensagem de erro;
        cy.get('.error').should('be.visible')                        
    })        
  
    it('Envia o formulário com sucessousando comando customizado', function() {
        cy.fillMandatoryFieldsAndSubmit()
        
        cy.get('.success').should('be.visible') 
    })

    //Campos de seleção suspensa, combo box
    it('Seleciona um produto (Youtube) pelo seu texto', function() {
        //Encadeia o get com o select pelo texto do item no combobox e depois encadeia com o valor se foi selecionado corretamente;
        cy.get('#product')
          .select('YouTube')
          .should('have.value', 'youtube')
    })

    it('Seleciona um produto (Mentoria) pelo seu valor', function() {
        //Encadeia o get com o select pelo valor do item no combobox e depois encadeia com o valor se foi selecionado corretamente;
        cy.get('#product')
          .select('mentoria')
          .should('have.value', 'mentoria')
    })

    it('Seleciona um produto (Blog) pelo seu indice', function() {
        //Encadeia o get com o select pelo indice do item no combobox e depois encadeia com o valor se foi selecionado corretamente;
        cy.get('#product')
          .select(1)
          .should('have.value', 'blog')
    })    

    //Elementos de seleção única do tipo Radio button
    it('Marca o tipo de atendimento "Feedback" no radio button', function() {
        //Encadeia o get com o select pelo indice do item do radio, verifica se esta checado, e valida se o valor cheado esta correto;
        cy.get('input[type="radio"][value="feedback"]')
          .check()
          .should('have.value', 'feedback')
    })    

    //Marca todos os elementos do tipo radio button
    it('Marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]')
          .should('have.length', 3)
          //Recebe uma função que recebe cada um dos argumentos retornados como radio; 
          .each(function($radio) {
            //Empacota para conseguir enviar comandos como check e should;
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
          })
    })        

    //Elementos de seleção check box
    it('Marca ambos checkboxes depois desmarca o último', function() {
        //Marca todos os checkbox da tela, verifica se esta marcado e depois desmarca o último e verifica se esta desmarcado;
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('be.not.checked')
    })
    
    //Seleção de arquivos
    it('Seleciona um arquivo da pasta Fixtures', function() {
        //Input do campo que tem o id #file-upload;
        cy.get('input[type="file"]#file-upload')
          .should('not.have.value')          
          //Seleciona o arquivo direto do caminho passsado;
          .selectFile('cypress/fixtures/example.json') 
          //Verifica se foi realmente selecionado, utilizando a função que recebe como argumento o elemento que foi passado no get; 
          .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
          })
          
    })
    
    //Simula que está selecionando o arquivo da pasta e arrastando para o campo de seleção do arquivo;
    it('Seleciona um arquivo simulando drag and drop', function() {    
        cy.get('input[type="file"]#file-upload')
          .should('not.have.value')          
          .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'}) 
          .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
          })        
    })

    it('Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {    
        //Determina um alias para o arquivo;
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]#file-upload')
          //Seleciona o arquivo com o alias dado anteriormente;
          .selectFile('@sampleFile')
          .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
          })
    })

    //Links que abrem em outra página

    //Sempre que o target da página for _blank, vai abrir em outra aba;
    it('Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() { 
        //Verifica se o get do elemento com id #privacy tem o atributo target _blank, sem precisar clicar no link;
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })   

    
    it.only('Acessa a página da política de privacidade removendo o target e então clicando no link', function() { 
        cy.get('#privacy a')
          //Remove o atributo target;  
          .invoke('removeAttr', 'target') 
          .click()
        
        //Abre o link na mesma aba e testa se um elemento está visível;
        cy.contains('Talking About Testing').should('be.visible')
    })        

})
