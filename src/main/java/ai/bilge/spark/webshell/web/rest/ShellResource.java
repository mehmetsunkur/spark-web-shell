package ai.bilge.spark.webshell.web.rest;

import com.codahale.metrics.annotation.Timed;
import ai.bilge.spark.webshell.domain.Shell;

import ai.bilge.spark.webshell.repository.ShellRepository;
import ai.bilge.spark.webshell.web.rest.errors.BadRequestAlertException;
import ai.bilge.spark.webshell.web.rest.util.HeaderUtil;
import ai.bilge.spark.webshell.service.dto.ShellDTO;
import ai.bilge.spark.webshell.service.mapper.ShellMapper;
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
 * REST controller for managing Shell.
 */
@RestController
@RequestMapping("/api")
public class ShellResource {

    private final Logger log = LoggerFactory.getLogger(ShellResource.class);

    private static final String ENTITY_NAME = "shell";

    private final ShellRepository shellRepository;

    private final ShellMapper shellMapper;

    public ShellResource(ShellRepository shellRepository, ShellMapper shellMapper) {
        this.shellRepository = shellRepository;
        this.shellMapper = shellMapper;
    }

    /**
     * POST  /shells : Create a new shell.
     *
     * @param shellDTO the shellDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new shellDTO, or with status 400 (Bad Request) if the shell has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/shells")
    @Timed
    public ResponseEntity<ShellDTO> createShell(@RequestBody ShellDTO shellDTO) throws URISyntaxException {
        log.debug("REST request to save Shell : {}", shellDTO);
        if (shellDTO.getId() != null) {
            throw new BadRequestAlertException("A new shell cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Shell shell = shellMapper.toEntity(shellDTO);
        shell = shellRepository.save(shell);
        ShellDTO result = shellMapper.toDto(shell);
        return ResponseEntity.created(new URI("/api/shells/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /shells : Updates an existing shell.
     *
     * @param shellDTO the shellDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated shellDTO,
     * or with status 400 (Bad Request) if the shellDTO is not valid,
     * or with status 500 (Internal Server Error) if the shellDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/shells")
    @Timed
    public ResponseEntity<ShellDTO> updateShell(@RequestBody ShellDTO shellDTO) throws URISyntaxException {
        log.debug("REST request to update Shell : {}", shellDTO);
        if (shellDTO.getId() == null) {
            return createShell(shellDTO);
        }
        Shell shell = shellMapper.toEntity(shellDTO);
        shell = shellRepository.save(shell);
        ShellDTO result = shellMapper.toDto(shell);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, shellDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /shells : get all the shells.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of shells in body
     */
    @GetMapping("/shells")
    @Timed
    public List<ShellDTO> getAllShells() {
        log.debug("REST request to get all Shells");
        List<Shell> shells = shellRepository.findAll();
        return shellMapper.toDto(shells);
        }

    /**
     * GET  /shells/:id : get the "id" shell.
     *
     * @param id the id of the shellDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the shellDTO, or with status 404 (Not Found)
     */
    @GetMapping("/shells/{id}")
    @Timed
    public ResponseEntity<ShellDTO> getShell(@PathVariable Long id) {
        log.debug("REST request to get Shell : {}", id);
        Shell shell = shellRepository.findOne(id);
        ShellDTO shellDTO = shellMapper.toDto(shell);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(shellDTO));
    }

    /**
     * DELETE  /shells/:id : delete the "id" shell.
     *
     * @param id the id of the shellDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/shells/{id}")
    @Timed
    public ResponseEntity<Void> deleteShell(@PathVariable Long id) {
        log.debug("REST request to delete Shell : {}", id);
        shellRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
