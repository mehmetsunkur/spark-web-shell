package ai.bilge.spark.webshell.web.rest;

import ai.bilge.spark.webshell.SparkWebShellApp;

import ai.bilge.spark.webshell.domain.Shell;
import ai.bilge.spark.webshell.repository.ShellRepository;
import ai.bilge.spark.webshell.service.dto.ShellDTO;
import ai.bilge.spark.webshell.service.mapper.ShellMapper;
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
 * Test class for the ShellResource REST controller.
 *
 * @see ShellResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SparkWebShellApp.class)
public class ShellResourceIntTest {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    @Autowired
    private ShellRepository shellRepository;

    @Autowired
    private ShellMapper shellMapper;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restShellMockMvc;

    private Shell shell;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ShellResource shellResource = new ShellResource(shellRepository, shellMapper);
        this.restShellMockMvc = MockMvcBuilders.standaloneSetup(shellResource)
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
    public static Shell createEntity(EntityManager em) {
        Shell shell = new Shell()
            .title(DEFAULT_TITLE);
        return shell;
    }

    @Before
    public void initTest() {
        shell = createEntity(em);
    }

    @Test
    @Transactional
    public void createShell() throws Exception {
        int databaseSizeBeforeCreate = shellRepository.findAll().size();

        // Create the Shell
        ShellDTO shellDTO = shellMapper.toDto(shell);
        restShellMockMvc.perform(post("/api/shells")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shellDTO)))
            .andExpect(status().isCreated());

        // Validate the Shell in the database
        List<Shell> shellList = shellRepository.findAll();
        assertThat(shellList).hasSize(databaseSizeBeforeCreate + 1);
        Shell testShell = shellList.get(shellList.size() - 1);
        assertThat(testShell.getTitle()).isEqualTo(DEFAULT_TITLE);
    }

    @Test
    @Transactional
    public void createShellWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = shellRepository.findAll().size();

        // Create the Shell with an existing ID
        shell.setId(1L);
        ShellDTO shellDTO = shellMapper.toDto(shell);

        // An entity with an existing ID cannot be created, so this API call must fail
        restShellMockMvc.perform(post("/api/shells")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shellDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Shell in the database
        List<Shell> shellList = shellRepository.findAll();
        assertThat(shellList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllShells() throws Exception {
        // Initialize the database
        shellRepository.saveAndFlush(shell);

        // Get all the shellList
        restShellMockMvc.perform(get("/api/shells?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(shell.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE.toString())));
    }

    @Test
    @Transactional
    public void getShell() throws Exception {
        // Initialize the database
        shellRepository.saveAndFlush(shell);

        // Get the shell
        restShellMockMvc.perform(get("/api/shells/{id}", shell.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(shell.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingShell() throws Exception {
        // Get the shell
        restShellMockMvc.perform(get("/api/shells/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateShell() throws Exception {
        // Initialize the database
        shellRepository.saveAndFlush(shell);
        int databaseSizeBeforeUpdate = shellRepository.findAll().size();

        // Update the shell
        Shell updatedShell = shellRepository.findOne(shell.getId());
        // Disconnect from session so that the updates on updatedShell are not directly saved in db
        em.detach(updatedShell);
        updatedShell
            .title(UPDATED_TITLE);
        ShellDTO shellDTO = shellMapper.toDto(updatedShell);

        restShellMockMvc.perform(put("/api/shells")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shellDTO)))
            .andExpect(status().isOk());

        // Validate the Shell in the database
        List<Shell> shellList = shellRepository.findAll();
        assertThat(shellList).hasSize(databaseSizeBeforeUpdate);
        Shell testShell = shellList.get(shellList.size() - 1);
        assertThat(testShell.getTitle()).isEqualTo(UPDATED_TITLE);
    }

    @Test
    @Transactional
    public void updateNonExistingShell() throws Exception {
        int databaseSizeBeforeUpdate = shellRepository.findAll().size();

        // Create the Shell
        ShellDTO shellDTO = shellMapper.toDto(shell);

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restShellMockMvc.perform(put("/api/shells")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(shellDTO)))
            .andExpect(status().isCreated());

        // Validate the Shell in the database
        List<Shell> shellList = shellRepository.findAll();
        assertThat(shellList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteShell() throws Exception {
        // Initialize the database
        shellRepository.saveAndFlush(shell);
        int databaseSizeBeforeDelete = shellRepository.findAll().size();

        // Get the shell
        restShellMockMvc.perform(delete("/api/shells/{id}", shell.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Shell> shellList = shellRepository.findAll();
        assertThat(shellList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Shell.class);
        Shell shell1 = new Shell();
        shell1.setId(1L);
        Shell shell2 = new Shell();
        shell2.setId(shell1.getId());
        assertThat(shell1).isEqualTo(shell2);
        shell2.setId(2L);
        assertThat(shell1).isNotEqualTo(shell2);
        shell1.setId(null);
        assertThat(shell1).isNotEqualTo(shell2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShellDTO.class);
        ShellDTO shellDTO1 = new ShellDTO();
        shellDTO1.setId(1L);
        ShellDTO shellDTO2 = new ShellDTO();
        assertThat(shellDTO1).isNotEqualTo(shellDTO2);
        shellDTO2.setId(shellDTO1.getId());
        assertThat(shellDTO1).isEqualTo(shellDTO2);
        shellDTO2.setId(2L);
        assertThat(shellDTO1).isNotEqualTo(shellDTO2);
        shellDTO1.setId(null);
        assertThat(shellDTO1).isNotEqualTo(shellDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(shellMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(shellMapper.fromId(null)).isNull();
    }
}
