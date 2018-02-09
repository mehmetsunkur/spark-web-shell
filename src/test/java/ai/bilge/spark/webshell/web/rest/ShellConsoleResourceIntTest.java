package ai.bilge.spark.webshell.web.rest;

import ai.bilge.spark.webshell.SparkWebShellApp;

import ai.bilge.spark.webshell.domain.ShellConsole;
import ai.bilge.spark.webshell.repository.ShellConsoleRepository;
import ai.bilge.spark.webshell.service.dto.ShellConsoleDTO;
import ai.bilge.spark.webshell.service.mapper.ShellConsoleMapper;
import ai.bilge.spark.webshell.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static ai.bilge.spark.webshell.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ShellConsoleResource REST controller.
 *
 * @see ShellConsoleResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SparkWebShellApp.class)
public class ShellConsoleResourceIntTest {

    private static final String DEFAULT_COMMAND = "AAAAAAAAAA";
    private static final String UPDATED_COMMAND = "BBBBBBBBBB";

    @Autowired
    private ShellConsoleRepository shellConsoleRepository;

    @Autowired
    private ShellConsoleMapper shellConsoleMapper;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restShellConsoleMockMvc;

    private ShellConsole shellConsole;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ShellConsoleResource shellConsoleResource = new ShellConsoleResource(shellConsoleRepository, shellConsoleMapper);
        this.restShellConsoleMockMvc = MockMvcBuilders.standaloneSetup(shellConsoleResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ShellConsole createEntity(EntityManager em) {
        ShellConsole shellConsole = new ShellConsole()
            .command(DEFAULT_COMMAND);
        return shellConsole;
    }

    @Before
    public void initTest() {
        shellConsole = createEntity(em);
    }

    @Test
    @Transactional
    public void createShellConsole() throws Exception {
        int databaseSizeBeforeCreate = shellConsoleRepository.findAll().size();

        // Create the ShellConsole
        ShellConsoleDTO shellConsoleDTO = shellConsoleMapper.toDto(shellConsole);
        restShellConsoleMockMvc.perform(post("/api/shell-consoles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shellConsoleDTO)))
            .andExpect(status().isCreated());

        // Validate the ShellConsole in the database
        List<ShellConsole> shellConsoleList = shellConsoleRepository.findAll();
        assertThat(shellConsoleList).hasSize(databaseSizeBeforeCreate + 1);
        ShellConsole testShellConsole = shellConsoleList.get(shellConsoleList.size() - 1);
        assertThat(testShellConsole.getCommand()).isEqualTo(DEFAULT_COMMAND);
    }

    @Test
    @Transactional
    public void createShellConsoleWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = shellConsoleRepository.findAll().size();

        // Create the ShellConsole with an existing ID
        shellConsole.setId(1L);
        ShellConsoleDTO shellConsoleDTO = shellConsoleMapper.toDto(shellConsole);

        // An entity with an existing ID cannot be created, so this API call must fail
        restShellConsoleMockMvc.perform(post("/api/shell-consoles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shellConsoleDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ShellConsole in the database
        List<ShellConsole> shellConsoleList = shellConsoleRepository.findAll();
        assertThat(shellConsoleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllShellConsoles() throws Exception {
        // Initialize the database
        shellConsoleRepository.saveAndFlush(shellConsole);

        // Get all the shellConsoleList
        restShellConsoleMockMvc.perform(get("/api/shell-consoles?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shellConsole.getId().intValue())))
            .andExpect(jsonPath("$.[*].command").value(hasItem(DEFAULT_COMMAND.toString())));
    }

    @Test
    @Transactional
    public void getShellConsole() throws Exception {
        // Initialize the database
        shellConsoleRepository.saveAndFlush(shellConsole);

        // Get the shellConsole
        restShellConsoleMockMvc.perform(get("/api/shell-consoles/{id}", shellConsole.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(shellConsole.getId().intValue()))
            .andExpect(jsonPath("$.command").value(DEFAULT_COMMAND.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingShellConsole() throws Exception {
        // Get the shellConsole
        restShellConsoleMockMvc.perform(get("/api/shell-consoles/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateShellConsole() throws Exception {
        // Initialize the database
        shellConsoleRepository.saveAndFlush(shellConsole);
        int databaseSizeBeforeUpdate = shellConsoleRepository.findAll().size();

        // Update the shellConsole
        ShellConsole updatedShellConsole = shellConsoleRepository.findOne(shellConsole.getId());
        // Disconnect from session so that the updates on updatedShellConsole are not directly saved in db
        em.detach(updatedShellConsole);
        updatedShellConsole
            .command(UPDATED_COMMAND);
        ShellConsoleDTO shellConsoleDTO = shellConsoleMapper.toDto(updatedShellConsole);

        restShellConsoleMockMvc.perform(put("/api/shell-consoles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shellConsoleDTO)))
            .andExpect(status().isOk());

        // Validate the ShellConsole in the database
        List<ShellConsole> shellConsoleList = shellConsoleRepository.findAll();
        assertThat(shellConsoleList).hasSize(databaseSizeBeforeUpdate);
        ShellConsole testShellConsole = shellConsoleList.get(shellConsoleList.size() - 1);
        assertThat(testShellConsole.getCommand()).isEqualTo(UPDATED_COMMAND);
    }

    @Test
    @Transactional
    public void updateNonExistingShellConsole() throws Exception {
        int databaseSizeBeforeUpdate = shellConsoleRepository.findAll().size();

        // Create the ShellConsole
        ShellConsoleDTO shellConsoleDTO = shellConsoleMapper.toDto(shellConsole);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restShellConsoleMockMvc.perform(put("/api/shell-consoles")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shellConsoleDTO)))
            .andExpect(status().isCreated());

        // Validate the ShellConsole in the database
        List<ShellConsole> shellConsoleList = shellConsoleRepository.findAll();
        assertThat(shellConsoleList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteShellConsole() throws Exception {
        // Initialize the database
        shellConsoleRepository.saveAndFlush(shellConsole);
        int databaseSizeBeforeDelete = shellConsoleRepository.findAll().size();

        // Get the shellConsole
        restShellConsoleMockMvc.perform(delete("/api/shell-consoles/{id}", shellConsole.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ShellConsole> shellConsoleList = shellConsoleRepository.findAll();
        assertThat(shellConsoleList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShellConsole.class);
        ShellConsole shellConsole1 = new ShellConsole();
        shellConsole1.setId(1L);
        ShellConsole shellConsole2 = new ShellConsole();
        shellConsole2.setId(shellConsole1.getId());
        assertThat(shellConsole1).isEqualTo(shellConsole2);
        shellConsole2.setId(2L);
        assertThat(shellConsole1).isNotEqualTo(shellConsole2);
        shellConsole1.setId(null);
        assertThat(shellConsole1).isNotEqualTo(shellConsole2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShellConsoleDTO.class);
        ShellConsoleDTO shellConsoleDTO1 = new ShellConsoleDTO();
        shellConsoleDTO1.setId(1L);
        ShellConsoleDTO shellConsoleDTO2 = new ShellConsoleDTO();
        assertThat(shellConsoleDTO1).isNotEqualTo(shellConsoleDTO2);
        shellConsoleDTO2.setId(shellConsoleDTO1.getId());
        assertThat(shellConsoleDTO1).isEqualTo(shellConsoleDTO2);
        shellConsoleDTO2.setId(2L);
        assertThat(shellConsoleDTO1).isNotEqualTo(shellConsoleDTO2);
        shellConsoleDTO1.setId(null);
        assertThat(shellConsoleDTO1).isNotEqualTo(shellConsoleDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(shellConsoleMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(shellConsoleMapper.fromId(null)).isNull();
    }
}
