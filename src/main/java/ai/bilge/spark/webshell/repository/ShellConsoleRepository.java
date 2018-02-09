package ai.bilge.spark.webshell.repository;

import ai.bilge.spark.webshell.domain.ShellConsole;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the ShellConsole entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ShellConsoleRepository extends JpaRepository<ShellConsole, Long> {

}
