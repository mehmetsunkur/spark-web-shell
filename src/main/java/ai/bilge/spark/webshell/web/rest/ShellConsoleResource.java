package ai.bilge.spark.webshell.web.rest;

import com.codahale.metrics.annotation.Timed;
import ai.bilge.spark.webshell.domain.ShellConsole;

import ai.bilge.spark.webshell.repository.ShellConsoleRepository;
import ai.bilge.spark.webshell.web.rest.errors.BadRequestAlertException;
import ai.bilge.spark.webshell.web.rest.util.HeaderUtil;
import ai.bilge.spark.webshell.service.dto.ShellConsoleDTO;
import ai.bilge.spark.webshell.service.mapper.ShellConsoleMapper;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing ShellConsole.
 */
@RestController
@RequestMapping("/api")
public class ShellConsoleResource {

    private final Logger log = LoggerFactory.getLogger(ShellConsoleResource.class);

    private static final String ENTITY_NAME = "shellConsole";

    private final ShellConsoleRepository shellConsoleRepository;

    private final ShellConsoleMapper shellConsoleMapper;

    public ShellConsoleResource(ShellConsoleRepository shellConsoleRepository, ShellConsoleMapper shellConsoleMapper) {
        this.shellConsoleRepository = shellConsoleRepository;
        this.shellConsoleMapper = shellConsoleMapper;
    }

    /**
     * POST  /shell-consoles : Create a new shellConsole.
     *
     * @param shellConsoleDTO the shellConsoleDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new shellConsoleDTO, or with status 400 (Bad Request) if the shellConsole has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/shell-consoles")
    @Timed
    public ResponseEntity<ShellConsoleDTO> createShellConsole(@RequestBody ShellConsoleDTO shellConsoleDTO) throws URISyntaxException {
        log.debug("REST request to save ShellConsole : {}", shellConsoleDTO);
        if (shellConsoleDTO.getId() != null) {
            throw new BadRequestAlertException("A new shellConsole cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ShellConsole shellConsole = shellConsoleMapper.toEntity(shellConsoleDTO);
        shellConsole = shellConsoleRepository.save(shellConsole);
        ShellConsoleDTO result = shellConsoleMapper.toDto(shellConsole);
        return ResponseEntity.created(new URI("/api/shell-consoles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /shell-consoles : Updates an existing shellConsole.
     *
     * @param shellConsoleDTO the shellConsoleDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated shellConsoleDTO,
     * or with status 400 (Bad Request) if the shellConsoleDTO is not valid,
     * or with status 500 (Internal Server Error) if the shellConsoleDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/shell-consoles")
    @Timed
    public ResponseEntity<ShellConsoleDTO> updateShellConsole(@RequestBody ShellConsoleDTO shellConsoleDTO) throws URISyntaxException {
        log.debug("REST request to update ShellConsole : {}", shellConsoleDTO);
        if (shellConsoleDTO.getId() == null) {
            return createShellConsole(shellConsoleDTO);
        }
        ShellConsole shellConsole = shellConsoleMapper.toEntity(shellConsoleDTO);
        shellConsole = shellConsoleRepository.save(shellConsole);
        ShellConsoleDTO result = shellConsoleMapper.toDto(shellConsole);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, shellConsoleDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /shell-consoles : get all the shellConsoles.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of shellConsoles in body
     */
    @GetMapping("/shell-consoles")
    @Timed
    public List<ShellConsoleDTO> getAllShellConsoles() {
        log.debug("REST request to get all ShellConsoles");
        List<ShellConsole> shellConsoles = shellConsoleRepository.findAll();
        return shellConsoleMapper.toDto(shellConsoles);
        }

    /**
     * GET  /shell-consoles/:id : get the "id" shellConsole.
     *
     * @param id the id of the shellConsoleDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the shellConsoleDTO, or with status 404 (Not Found)
     */
    @GetMapping("/shell-consoles/{id}")
    @Timed
    public ResponseEntity<ShellConsoleDTO> getShellConsole(@PathVariable Long id) {
        log.debug("REST request to get ShellConsole : {}", id);
        ShellConsole shellConsole = shellConsoleRepository.findOne(id);
        ShellConsoleDTO shellConsoleDTO = shellConsoleMapper.toDto(shellConsole);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(shellConsoleDTO));
    }

    /**
     * DELETE  /shell-consoles/:id : delete the "id" shellConsole.
     *
     * @param id the id of the shellConsoleDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/shell-consoles/{id}")
    @Timed
    public ResponseEntity<Void> deleteShellConsole(@PathVariable Long id) {
        log.debug("REST request to delete ShellConsole : {}", id);
        shellConsoleRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
